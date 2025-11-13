import { MessageId } from '../value-objects/MessageId';

/**
 * Message Entity
 * Represents a single message in a chat conversation
 */
export class Message {
  private constructor(
    public readonly id: MessageId,
    public readonly chatId: string,
    public readonly role: 'user' | 'assistant',
    public readonly content: string,
    public readonly type: 'text' | 'voice',
    public readonly timestamp: Date,
    public readonly audioUrl?: string,
    public readonly duration?: number
  ) {}

  /**
   * Factory method to create a new user text message
   */
  static createUserTextMessage(chatId: string, content: string): Message {
    return new Message(
      MessageId.generate(),
      chatId,
      'user',
      content,
      'text',
      new Date()
    );
  }

  /**
   * Factory method to create a new user voice message
   */
  static createUserVoiceMessage(
    chatId: string,
    content: string,
    audioUrl: string,
    duration: number
  ): Message {
    return new Message(
      MessageId.generate(),
      chatId,
      'user',
      content,
      'voice',
      new Date(),
      audioUrl,
      duration
    );
  }

  /**
   * Factory method to create an assistant response
   */
  static createAssistantMessage(chatId: string, content: string): Message {
    return new Message(
      MessageId.generate(),
      chatId,
      'assistant',
      content,
      'text',
      new Date()
    );
  }

  /**
   * Reconstruct a message from persistence (used by repositories)
   */
  static reconstitute(
    id: MessageId,
    chatId: string,
    role: 'user' | 'assistant',
    content: string,
    type: 'text' | 'voice',
    timestamp: Date,
    audioUrl?: string,
    duration?: number
  ): Message {
    return new Message(id, chatId, role, content, type, timestamp, audioUrl, duration);
  }
}
