import { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';

/**
 * In-memory implementation of IChatRepository
 * Useful for development and testing
 * Data is lost on server restart
 */
export class InMemoryChatRepository extends IChatRepository {
  private chats: Map<string, Chat> = new Map();

  async findById(id: ChatId): Promise<Chat | null> {
    const chat = this.chats.get(id.toString());
    return chat || null;
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    const userChats: Chat[] = [];

    for (const chat of this.chats.values()) {
      if (chat.userId === userId) {
        userChats.push(chat);
      }
    }

    return userChats;
  }

  async findByAssistantId(assistantId: string): Promise<Chat[]> {
    const assistantChats: Chat[] = [];

    for (const chat of this.chats.values()) {
      if (chat.assistantId === assistantId) {
        assistantChats.push(chat);
      }
    }

    return assistantChats;
  }

  async save(chat: Chat): Promise<void> {
    this.chats.set(chat.id.toString(), chat);
  }

  async update(chat: Chat): Promise<void> {
    if (!this.chats.has(chat.id.toString())) {
      throw new Error(`Chat with id ${chat.id.toString()} not found`);
    }

    this.chats.set(chat.id.toString(), chat);
  }

  async delete(id: ChatId): Promise<void> {
    this.chats.delete(id.toString());
  }

  async exists(id: ChatId): Promise<boolean> {
    return this.chats.has(id.toString());
  }

  /**
   * Helper method for testing - clear all chats
   */
  clear(): void {
    this.chats.clear();
  }

  /**
   * Helper method for testing - get all chats
   */
  getAll(): Chat[] {
    return Array.from(this.chats.values());
  }
}
