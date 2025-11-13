import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/di/types';
import type { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { NotFoundError } from '@/shared/lib/errors/NotFoundError';

/**
 * Use Case: Delete Chat
 * Deletes a chat by its ID
 */
@injectable()
export class DeleteChatUseCase {
  constructor(
    @inject(TYPES.IChatRepository)
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(chatId: string, userId: string): Promise<void> {
    // Find the chat to verify it exists and belongs to the user
    const chatIdVO = ChatId.fromString(chatId);
    const chat = await this.chatRepository.findById(chatIdVO);

    if (!chat) {
      throw new NotFoundError(`Chat with ID ${chatId} not found`);
    }

    // Business rule: Users can only delete their own chats
    if (chat.userId !== userId) {
      throw new Error('You can only delete your own chats');
    }

    // Delete the chat
    await this.chatRepository.delete(chatIdVO);
  }
}
