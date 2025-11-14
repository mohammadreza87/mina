import { Chat } from '@/core/domain/entities/Chat';
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { ValidationError } from '@/shared/lib/errors/ValidationError';

/**
 * Use Case: Get all chats for a user
 */
export class GetUserChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(userId: string): Promise<Chat[]> {
    if (!userId || userId.trim() === '') {
      throw new ValidationError('User ID is required');
    }

    const chats = await this.chatRepository.findByUserId(userId);

    // Sort by updatedAt descending (most recent first)
    return chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}
