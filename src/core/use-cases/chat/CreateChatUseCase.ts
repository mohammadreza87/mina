import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/di/types';
import { Chat } from '@/core/domain/entities/Chat';
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { ValidationError } from '@/shared/lib/errors/ValidationError';
import { z } from 'zod';

/**
 * DTO for creating a chat
 */
export interface CreateChatDTO {
  userId: string;
  assistantId: string;
  title: string;
  voiceStyle: string;
  topic: string;
  instructions: string;
}

/**
 * Validation schema for CreateChatDTO
 */
const createChatSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  assistantId: z.string().min(1, 'Assistant ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  voiceStyle: z.string().min(1, 'Voice style is required'),
  topic: z.string().min(1, 'Topic is required'),
  instructions: z.string().optional().default(''),
});

/**
 * Use Case: Create a new chat
 * Business logic for chat creation with validation
 */
@injectable()
export class CreateChatUseCase {
  constructor(
    @inject(TYPES.IChatRepository) private chatRepository: IChatRepository
  ) {}

  async execute(dto: CreateChatDTO): Promise<Chat> {
    // 1. Validate input
    const validationResult = createChatSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid chat data',
        validationResult.error.errors
      );
    }

    const validatedData = validationResult.data;

    // 2. Business rule: Check if user has too many chats (optional limit)
    const userChats = await this.chatRepository.findByUserId(validatedData.userId);
    const MAX_CHATS_PER_USER = 50;

    if (userChats.length >= MAX_CHATS_PER_USER) {
      throw new ValidationError(
        `Maximum chat limit reached (${MAX_CHATS_PER_USER}). Please delete some chats before creating new ones.`
      );
    }

    // 3. Create chat entity (domain logic)
    const chat = Chat.create({
      userId: validatedData.userId,
      assistantId: validatedData.assistantId,
      title: validatedData.title,
      voiceStyle: validatedData.voiceStyle,
      topic: validatedData.topic,
      instructions: validatedData.instructions,
    });

    // 4. Persist the chat
    await this.chatRepository.save(chat);

    // 5. Return the created chat
    return chat;
  }
}
