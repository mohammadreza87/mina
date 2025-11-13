import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/di/types';
import type { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import type { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { NotFoundError } from '@/shared/lib/errors/NotFoundError';

/**
 * Use Case: Get Chat By ID
 * Retrieves a single chat by its ID
 */
@injectable()
export class GetChatByIdUseCase {
  constructor(
    @inject(TYPES.IChatRepository)
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(chatId: string): Promise<Chat> {
    const chatIdVO = ChatId.fromString(chatId);
    const chat = await this.chatRepository.findById(chatIdVO);

    if (!chat) {
      throw new NotFoundError(`Chat with ID ${chatId} not found`);
    }

    return chat;
  }
}
