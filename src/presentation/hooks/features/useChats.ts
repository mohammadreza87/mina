'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function ensureOk(response: Response, fallbackMessage: string) {
  if (response.status === 401) {
    throw new Error('Not authenticated. Please sign in.');
  }

  if (!response.ok) {
    let errorBody: { error?: string; message?: string } | null = null;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = null;
    }

    throw new Error(errorBody?.error || errorBody?.message || fallbackMessage);
  }
}

/**
 * Message DTO
 */
export interface MessageDTO {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'voice';
  timestamp: string;
  audioUrl?: string;
  duration?: number;
}

/**
 * Chat DTO (matches API response)
 */
export interface ChatDTO {
  id: string;
  userId: string;
  assistantId: string;
  title: string;
  voiceStyle: string;
  topic: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  messages?: MessageDTO[];
}

/**
 * Input for creating a chat
 */
export interface CreateChatInput {
  assistantId: string;
  title: string;
  voiceStyle: string;
  topic: string;
  instructions?: string;
}

/**
 * Input for updating chat settings
 */
export interface UpdateChatInput {
  chatId: string;
  title?: string;
  voiceStyle?: string;
  topic?: string;
  instructions?: string;
}

/**
 * Input for sending a message
 */
export interface SendMessageInput {
  chatId: string;
  role?: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'voice';
  audioUrl?: string;
  duration?: number;
}

/**
 * Hook for managing chats using the new architecture
 * Replaces the old useChatSessions hook
 */
export function useChats() {
  const queryClient = useQueryClient();

  // Query: Get all chats
  const {
    data: chats = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ChatDTO[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await fetch('/api/chats');
      await ensureOk(response, 'Failed to fetch chats');
      return response.json();
    },
  });

  // Mutation: Create a new chat
  const createChatMutation = useMutation({
    mutationFn: async (input: CreateChatInput) => {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      await ensureOk(response, 'Failed to create chat');
      return response.json() as Promise<ChatDTO>;
    },
    onSuccess: (newChat) => {
      // Optimistic update: Add new chat to the list
      queryClient.setQueryData<ChatDTO[]>(['chats'], (old = []) => [newChat, ...old]);
    },
    onError: (error) => {
      console.error('Failed to create chat:', error);
    },
  });

  // Mutation: Update chat settings
  const updateChatMutation = useMutation({
    mutationFn: async (input: UpdateChatInput) => {
      const { chatId, ...updates } = input;
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await ensureOk(response, 'Failed to update chat');
      return response.json() as Promise<ChatDTO>;
    },
    onSuccess: (updatedChat) => {
      // Update chat in the list
      queryClient.setQueryData<ChatDTO[]>(['chats'], (old = []) =>
        old.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      );
      // Also update individual chat query if it exists
      queryClient.setQueryData(['chat', updatedChat.id], updatedChat);
    },
  });

  // Mutation: Delete chat
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      });
      await ensureOk(response, 'Failed to delete chat');
      return chatId;
    },
    onSuccess: (deletedChatId) => {
      // Remove chat from the list
      queryClient.setQueryData<ChatDTO[]>(['chats'], (old = []) =>
        old.filter((chat) => chat.id !== deletedChatId)
      );
      // Invalidate individual chat query
      queryClient.removeQueries({ queryKey: ['chat', deletedChatId] });
    },
  });

  // Mutation: Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const { chatId, ...messageData } = input;
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      await ensureOk(response, 'Failed to send message');
      return response.json() as Promise<MessageDTO>;
    },
    onSuccess: (newMessage) => {
      // Invalidate chat query to refetch with new message
      queryClient.invalidateQueries({ queryKey: ['chat', newMessage.chatId] });
      // Also refetch chats list to update last message
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  return {
    // Data
    chats,
    isLoading,
    error: error as Error | null,

    // Create chat
    createChat: createChatMutation.mutate,
    createChatAsync: createChatMutation.mutateAsync,
    isCreating: createChatMutation.isPending,
    createError: createChatMutation.error as Error | null,

    // Update chat
    updateChat: updateChatMutation.mutate,
    updateChatAsync: updateChatMutation.mutateAsync,
    isUpdating: updateChatMutation.isPending,
    updateError: updateChatMutation.error as Error | null,

    // Delete chat
    deleteChat: deleteChatMutation.mutate,
    deleteChatAsync: deleteChatMutation.mutateAsync,
    isDeleting: deleteChatMutation.isPending,
    deleteError: deleteChatMutation.error as Error | null,

    // Send message
    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error as Error | null,

    // Utilities
    refetch,
  };
}

/**
 * Hook for managing a single chat
 * Use this when you need to fetch and work with a specific chat
 */
export function useChat(chatId: string | null) {
  const queryClient = useQueryClient();

  // Query: Get single chat
  const {
    data: chat,
    isLoading,
    error,
    refetch,
  } = useQuery<ChatDTO>({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      if (!chatId) throw new Error('Chat ID is required');

      const response = await fetch(`/api/chats/${chatId}`);
      await ensureOk(response, 'Failed to fetch chat');
      return response.json();
    },
    enabled: !!chatId, // Only fetch if chatId is provided
  });

  // Mutation: Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (input: Omit<SendMessageInput, 'chatId'>) => {
      if (!chatId) throw new Error('Chat ID is required');

      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      await ensureOk(response, 'Failed to send message');
      return response.json() as Promise<MessageDTO>;
    },
    onSuccess: () => {
      // Refetch the chat to get updated messages
      refetch();
      // Also invalidate chats list
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  // Mutation: Update chat settings
  const updateChatMutation = useMutation({
    mutationFn: async (updates: Omit<UpdateChatInput, 'chatId'>) => {
      if (!chatId) throw new Error('Chat ID is required');

      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      await ensureOk(response, 'Failed to update chat');
      return response.json() as Promise<ChatDTO>;
    },
    onSuccess: (updatedChat) => {
      // Update the query data
      queryClient.setQueryData(['chat', chatId], updatedChat);
      // Also update chats list if it exists
      queryClient.setQueryData<ChatDTO[]>(['chats'], (old = []) =>
        old.map((c) => (c.id === chatId ? updatedChat : c))
      );
    },
  });

  return {
    // Data
    chat,
    isLoading,
    error: error as Error | null,

    // Actions
    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error as Error | null,

    updateChat: updateChatMutation.mutate,
    updateChatAsync: updateChatMutation.mutateAsync,
    isUpdating: updateChatMutation.isPending,
    updateError: updateChatMutation.error as Error | null,

    // Utilities
    refetch,
  };
}
