import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';

/**
 * Port interface for Chat repository
 * Defines the contract for chat data persistence
 * Implementation can be Prisma, in-memory, MongoDB, etc.
 */
export interface IChatRepository {
  /**
   * Find a chat by its unique identifier
   */
  findById(id: ChatId): Promise<Chat | null>;

  /**
   * Find all chats for a specific user
   */
  findByUserId(userId: string): Promise<Chat[]>;

  /**
   * Find chats by assistant ID
   */
  findByAssistantId(assistantId: string): Promise<Chat[]>;

  /**
   * Save a new chat
   */
  save(chat: Chat): Promise<void>;

  /**
   * Update an existing chat
   */
  update(chat: Chat): Promise<void>;

  /**
   * Delete a chat by ID
   */
  delete(id: ChatId): Promise<void>;

  /**
   * Check if a chat exists
   */
  exists(id: ChatId): Promise<boolean>;
}
