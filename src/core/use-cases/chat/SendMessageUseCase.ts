import { z } from 'zod';
import type { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import type { Chat } from '@/core/domain/entities/Chat';
import { Message } from '@/core/domain/entities/Message';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { NotFoundError } from '@/shared/lib/errors/NotFoundError';
import { ValidationError } from '@/shared/lib/errors/ValidationError';

/**
 * DTO for sending a message
 */
export interface SendMessageDTO {
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'voice';
  audioUrl?: string;
  duration?: number;
}

/**
 * Validation schema
 */
const sendMessageSchema = z.object({
  chatId: z.string().min(1, 'Chat ID is required'),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['text', 'voice']),
  audioUrl: z.string().url().optional(),
  duration: z.number().positive().optional(),
});

/**
 * Use Case: Send Message
 * Adds a new message to an existing chat
 */
export class SendMessageUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(dto: SendMessageDTO): Promise<Chat> {
    // Validate input
    const validationResult = sendMessageSchema.safeParse(dto);
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid message data',
        validationResult.error.issues
      );
    }

    // Find the chat
    const chatIdVO = ChatId.fromString(dto.chatId);
    const chat = await this.chatRepository.findById(chatIdVO);
    if (!chat) {
      throw new NotFoundError(`Chat with ID ${dto.chatId} not found`);
    }

    // Create message entity based on type and role
    let message: Message;

    if (dto.role === 'user') {
      if (dto.type === 'voice' && dto.audioUrl && dto.duration) {
        message = Message.createUserVoiceMessage(
          dto.chatId,
          dto.content,
          dto.audioUrl,
          dto.duration
        );
      } else {
        message = Message.createUserTextMessage(dto.chatId, dto.content);
      }
    } else {
      message = Message.createAssistantMessage(dto.chatId, dto.content);
    }

    // Add message to chat (domain logic)
    chat.addMessage(message);

    // Persist the updated chat
    await this.chatRepository.update(chat);

    return chat;
  }
}
