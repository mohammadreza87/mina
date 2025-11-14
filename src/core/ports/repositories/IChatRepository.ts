import type { Chat } from '@/core/domain/entities/Chat';
import type { ChatId } from '@/core/domain/value-objects/ChatId';

/**
 * Port interface for Chat repository
 * Defines the contract for chat data persistence
 * Implementation can be Prisma, in-memory, MongoDB, etc.
 *
 * Using abstract class instead of interface for Turbopack compatibility
 */
export abstract class IChatRepository {
  /**
   * Find a chat by its unique identifier
   */
  abstract findById(id: ChatId): Promise<Chat | null>;

  /**
   * Find all chats for a specific user
   */
  abstract findByUserId(userId: string): Promise<Chat[]>;

  /**
   * Find chats by assistant ID
   */
  abstract findByAssistantId(assistantId: string): Promise<Chat[]>;

  /**
   * Save a new chat
   */
  abstract save(chat: Chat): Promise<void>;

  /**
   * Update an existing chat
   */
  abstract update(chat: Chat): Promise<void>;

  /**
   * Delete a chat by ID
   */
  abstract delete(id: ChatId): Promise<void>;

  /**
   * Check if a chat exists
   */
  abstract exists(id: ChatId): Promise<boolean>;
}
