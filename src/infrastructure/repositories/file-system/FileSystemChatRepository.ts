import { promises as fs } from 'node:fs';
import path from 'node:path';
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { Message } from '@/core/domain/entities/Message';
import { MessageId } from '@/core/domain/value-objects/MessageId';

type MessageRecord = {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'voice';
  timestamp: string;
  audioUrl?: string;
  duration?: number;
};

type ChatRecord = {
  id: string;
  userId: string;
  assistantId: string;
  title: string;
  voiceStyle: string;
  topic: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageRecord[];
};

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'chats.json');

export class FileSystemChatRepository extends IChatRepository {
  private async ensureStore(): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
  }

  private async readAll(): Promise<ChatRecord[]> {
    await this.ensureStore();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    try {
      return JSON.parse(raw) as ChatRecord[];
    } catch {
      return [];
    }
  }

  private async writeAll(chats: ChatRecord[]): Promise<void> {
    await this.ensureStore();
    await fs.writeFile(DATA_FILE, JSON.stringify(chats, null, 2), 'utf-8');
  }

  private hydrate(record: ChatRecord): Chat {
    const messages = record.messages?.map(
      (message) =>
        Message.reconstitute(
          MessageId.fromString(message.id),
          message.chatId,
          message.role,
          message.content,
          message.type,
          new Date(message.timestamp),
          message.audioUrl,
          message.duration
        )
    ) ?? [];

    return Chat.reconstitute(
      ChatId.fromString(record.id),
      record.userId,
      record.assistantId,
      record.title,
      record.voiceStyle,
      record.topic,
      record.instructions,
      new Date(record.createdAt),
      new Date(record.updatedAt),
      messages
    );
  }

  private dehydrate(chat: Chat): ChatRecord {
    return {
      id: chat.id.toString(),
      userId: chat.userId,
      assistantId: chat.assistantId,
      title: chat.title,
      voiceStyle: chat.voiceStyle,
      topic: chat.topic,
      instructions: chat.instructions,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map((message) => ({
        id: message.id.toString(),
        chatId: message.chatId,
        role: message.role,
        content: message.content,
        type: message.type,
        timestamp: message.timestamp.toISOString(),
        audioUrl: message.audioUrl,
        duration: message.duration,
      })),
    };
  }

  async findById(id: ChatId): Promise<Chat | null> {
    const chats = await this.readAll();
    const chat = chats.find((entry) => entry.id === id.toString());
    return chat ? this.hydrate(chat) : null;
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    const chats = await this.readAll();
    return chats
      .filter((entry) => entry.userId === userId)
      .map((entry) => this.hydrate(entry));
  }

  async findByAssistantId(assistantId: string): Promise<Chat[]> {
    const chats = await this.readAll();
    return chats
      .filter((entry) => entry.assistantId === assistantId)
      .map((entry) => this.hydrate(entry));
  }

  async save(chat: Chat): Promise<void> {
    const chats = await this.readAll();
    chats.push(this.dehydrate(chat));
    await this.writeAll(chats);
  }

  async update(chat: Chat): Promise<void> {
    const chats = await this.readAll();
    const index = chats.findIndex((entry) => entry.id === chat.id.toString());
    if (index === -1) {
      throw new Error(`Chat with id ${chat.id.toString()} not found`);
    }
    chats[index] = this.dehydrate(chat);
    await this.writeAll(chats);
  }

  async delete(id: ChatId): Promise<void> {
    const chats = await this.readAll();
    const next = chats.filter((entry) => entry.id !== id.toString());
    await this.writeAll(next);
  }

  async exists(id: ChatId): Promise<boolean> {
    const chats = await this.readAll();
    return chats.some((entry) => entry.id === id.toString());
  }
}
