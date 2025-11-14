import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { TYPES } from '@/config/di/types';
import type { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import type { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { NotFoundError } from '@/shared/lib/errors/NotFoundError';
import { ValidationError } from '@/shared/lib/errors/ValidationError';

/**
 * DTO for updating chat settings
 */
export interface UpdateChatSettingsDTO {
  chatId: string;
  title?: string;
  voiceStyle?: string;
  topic?: string;
  instructions?: string;
}

/**
 * Validation schema
 */
const updateChatSettingsSchema = z.object({
  chatId: z.string().min(1, 'Chat ID is required'),
  title: z.string().min(1).max(100).optional(),
  voiceStyle: z.string().optional(),
  topic: z.string().optional(),
  instructions: z.string().optional(),
});

/**
 * Use Case: Update Chat Settings
 * Updates the settings of an existing chat
 */
@injectable()
export class UpdateChatSettingsUseCase {
  constructor(
    @inject(TYPES.IChatRepository)
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(dto: UpdateChatSettingsDTO): Promise<Chat> {
    // Validate input
    const validationResult = updateChatSettingsSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid chat settings data',
        validationResult.error.issues
      );
    }

    // Find the chat
    const chatIdVO = ChatId.fromString(dto.chatId);
    const chat = await this.chatRepository.findById(chatIdVO);
    if (!chat) {
      throw new NotFoundError(`Chat with ID ${dto.chatId} not found`);
    }

    // Update chat settings (domain logic)
    chat.updateSettings({
      title: dto.title,
      voiceStyle: dto.voiceStyle,
      topic: dto.topic,
      instructions: dto.instructions,
    });

    // Persist the updated chat
    await this.chatRepository.update(chat);

    return chat;
  }
}
