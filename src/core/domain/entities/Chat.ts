import { ChatId } from '../value-objects/ChatId';
import { Message } from './Message';

/**
 * Chat Entity (Aggregate Root)
 * Encapsulates chat business logic and maintains consistency
 */
export class Chat {
  private _messages: Message[] = [];

  private constructor(
    public readonly id: ChatId,
    public readonly userId: string,
    public readonly assistantId: string,
    public title: string,
    public voiceStyle: string,
    public topic: string,
    public instructions: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    messages: Message[] = []
  ) {
    this._messages = messages;
  }

  /**
   * Factory method to create a new Chat
   */
  static create(params: {
    userId: string;
    assistantId: string;
    title: string;
    voiceStyle: string;
    topic: string;
    instructions: string;
  }): Chat {
    const now = new Date();

    // Business rules validation
    if (!params.userId) throw new Error('User ID is required');
    if (!params.assistantId) throw new Error('Assistant ID is required');
    if (!params.title || params.title.trim() === '') {
      throw new Error('Chat title is required');
    }

    return new Chat(
      ChatId.generate(),
      params.userId,
      params.assistantId,
      params.title,
      params.voiceStyle,
      params.topic,
      params.instructions,
      now,
      now
    );
  }

  /**
   * Reconstitute a chat from persistence (used by repositories)
   */
  static reconstitute(
    id: ChatId,
    userId: string,
    assistantId: string,
    title: string,
    voiceStyle: string,
    topic: string,
    instructions: string,
    createdAt: Date,
    updatedAt: Date,
    messages: Message[] = []
  ): Chat {
    return new Chat(
      id,
      userId,
      assistantId,
      title,
      voiceStyle,
      topic,
      instructions,
      createdAt,
      updatedAt,
      messages
    );
  }

  /**
   * Get messages as readonly array
   */
  get messages(): ReadonlyArray<Message> {
    return this._messages;
  }

  /**
   * Add a message to the chat
   * Business rule: Only add valid messages
   */
  addMessage(message: Message): void {
    if (message.chatId !== this.id.toString()) {
      throw new Error('Message does not belong to this chat');
    }

    this._messages.push(message);
    this.updatedAt = new Date();
  }

  /**
   * Update chat settings
   */
  updateSettings(params: {
    title?: string;
    voiceStyle?: string;
    topic?: string;
    instructions?: string;
  }): void {
    if (params.title !== undefined) {
      if (params.title.trim() === '') {
        throw new Error('Title cannot be empty');
      }
      this.title = params.title;
    }

    if (params.voiceStyle !== undefined) {
      this.voiceStyle = params.voiceStyle;
    }

    if (params.topic !== undefined) {
      this.topic = params.topic;
    }

    if (params.instructions !== undefined) {
      this.instructions = params.instructions;
    }

    this.updatedAt = new Date();
  }

  /**
   * Get the last message in the chat
   */
  getLastMessage(): Message | undefined {
    return this._messages[this._messages.length - 1];
  }

  /**
   * Get total message count
   */
  getMessageCount(): number {
    return this._messages.length;
  }
}
