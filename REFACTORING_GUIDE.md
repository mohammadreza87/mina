# Mina - Practical Refactoring Guide

## Current vs. Proposed: Side-by-Side Comparison

This guide shows concrete examples of refactoring the current codebase to follow the proposed architecture.

---

## Example 1: Refactoring Chat Creation

### CURRENT IMPLEMENTATION (Tightly Coupled)

```typescript
// ❌ hooks/useChatSessions.ts (current)
export function useChatSessions() {
  const [chats, setChats] = useState<ChatSession[]>([]);

  const createChat = (payload: {
    assistantId: string;
    voiceStyle: string;
    topic: string;
    instructions: string;
  }) => {
    const newChat: ChatSession = {
      id: uuidv4(),
      title: `Chat with ${getAssistantById(payload.assistantId)?.name}`,
      assistantId: payload.assistantId,
      voiceStyle: payload.voiceStyle,
      topic: payload.topic,
      instructions: payload.instructions,
      createdAt: new Date().toISOString(),
      lastMessage: "",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    return newChat;
  };

  return { chats, createChat };
}
```

**Problems:**
- Business logic mixed with state management
- Hard to test without React
- No validation
- No persistence (in-memory only)
- Tight coupling to React hooks

---

### PROPOSED IMPLEMENTATION (Layered Architecture)

#### Step 1: Domain Entity

```typescript
// ✅ core/domain/entities/Chat.ts
import { ChatId } from '../value-objects/ChatId';
import { Message } from './Message';

export class Chat {
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
    private _messages: Message[] = []
  ) {}

  static create(params: {
    userId: string;
    assistantId: string;
    title: string;
    voiceStyle: string;
    topic: string;
    instructions: string;
  }): Chat {
    const now = new Date();
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

  get messages(): ReadonlyArray<Message> {
    return this._messages;
  }

  addMessage(message: Message): void {
    this._messages.push(message);
    this.updatedAt = new Date();
  }

  updateSettings(params: {
    title?: string;
    voiceStyle?: string;
    topic?: string;
    instructions?: string;
  }): void {
    if (params.title) this.title = params.title;
    if (params.voiceStyle) this.voiceStyle = params.voiceStyle;
    if (params.topic) this.topic = params.topic;
    if (params.instructions) this.instructions = params.instructions;
    this.updatedAt = new Date();
  }
}
```

#### Step 2: Value Object

```typescript
// ✅ core/domain/value-objects/ChatId.ts
import { v4 as uuidv4 } from 'uuid';

export class ChatId {
  private constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('ChatId cannot be empty');
    }
  }

  static generate(): ChatId {
    return new ChatId(uuidv4());
  }

  static fromString(value: string): ChatId {
    return new ChatId(value);
  }

  equals(other: ChatId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

#### Step 3: Repository Interface (Port)

```typescript
// ✅ core/ports/repositories/IChatRepository.ts
import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';

export interface IChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByUserId(userId: string): Promise<Chat[]>;
  save(chat: Chat): Promise<void>;
  update(chat: Chat): Promise<void>;
  delete(id: ChatId): Promise<void>;
}
```

#### Step 4: Use Case (Application Layer)

```typescript
// ✅ core/use-cases/chat/CreateChatUseCase.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/di/types';
import { Chat } from '@/core/domain/entities/Chat';
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { IAssistantRepository } from '@/core/ports/repositories/IAssistantRepository';
import { ValidationError } from '@/shared/lib/errors/ValidationError';

export interface CreateChatDTO {
  userId: string;
  assistantId: string;
  voiceStyle: string;
  topic: string;
  instructions: string;
}

@injectable()
export class CreateChatUseCase {
  constructor(
    @inject(TYPES.IChatRepository) private chatRepo: IChatRepository,
    @inject(TYPES.IAssistantRepository) private assistantRepo: IAssistantRepository
  ) {}

  async execute(dto: CreateChatDTO): Promise<Chat> {
    // 1. Validation
    this.validate(dto);

    // 2. Check if assistant exists
    const assistant = await this.assistantRepo.findById(dto.assistantId);
    if (!assistant) {
      throw new ValidationError('Assistant not found');
    }

    // 3. Create chat entity
    const chat = Chat.create({
      userId: dto.userId,
      assistantId: dto.assistantId,
      title: `Chat with ${assistant.name}`,
      voiceStyle: dto.voiceStyle,
      topic: dto.topic,
      instructions: dto.instructions,
    });

    // 4. Persist
    await this.chatRepo.save(chat);

    // 5. Return domain entity
    return chat;
  }

  private validate(dto: CreateChatDTO): void {
    if (!dto.userId) throw new ValidationError('User ID is required');
    if (!dto.assistantId) throw new ValidationError('Assistant ID is required');
    if (!dto.voiceStyle) throw new ValidationError('Voice style is required');
    if (!dto.topic) throw new ValidationError('Topic is required');
  }
}
```

#### Step 5: Repository Implementation (Infrastructure)

```typescript
// ✅ infrastructure/repositories/prisma/PrismaChatRepository.ts
import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { ChatMapper } from './mappers/ChatMapper';

@injectable()
export class PrismaChatRepository implements IChatRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: ChatId): Promise<Chat | null> {
    const record = await this.prisma.chat.findUnique({
      where: { id: id.toString() },
      include: { messages: true },
    });

    return record ? ChatMapper.toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    const records = await this.prisma.chat.findMany({
      where: { userId },
      include: { messages: true },
      orderBy: { updatedAt: 'desc' },
    });

    return records.map(ChatMapper.toDomain);
  }

  async save(chat: Chat): Promise<void> {
    const data = ChatMapper.toPersistence(chat);

    await this.prisma.chat.create({
      data: {
        id: data.id,
        userId: data.userId,
        assistantId: data.assistantId,
        title: data.title,
        voiceStyle: data.voiceStyle,
        topic: data.topic,
        instructions: data.instructions,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async update(chat: Chat): Promise<void> {
    const data = ChatMapper.toPersistence(chat);

    await this.prisma.chat.update({
      where: { id: data.id },
      data: {
        title: data.title,
        voiceStyle: data.voiceStyle,
        topic: data.topic,
        instructions: data.instructions,
        updatedAt: data.updatedAt,
      },
    });
  }

  async delete(id: ChatId): Promise<void> {
    await this.prisma.chat.delete({
      where: { id: id.toString() },
    });
  }
}
```

#### Step 6: Mapper (Data Transformation)

```typescript
// ✅ infrastructure/repositories/prisma/mappers/ChatMapper.ts
import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';
import { Message } from '@/core/domain/entities/Message';
import { Chat as PrismaChat, Message as PrismaMessage } from '@prisma/client';

export class ChatMapper {
  static toDomain(raw: PrismaChat & { messages: PrismaMessage[] }): Chat {
    const messages = raw.messages.map(MessageMapper.toDomain);

    return Chat.create({
      userId: raw.userId,
      assistantId: raw.assistantId,
      title: raw.title,
      voiceStyle: raw.voiceStyle,
      topic: raw.topic,
      instructions: raw.instructions,
    });
    // Note: In real implementation, use a factory that accepts all fields
  }

  static toPersistence(chat: Chat) {
    return {
      id: chat.id.toString(),
      userId: chat.userId,
      assistantId: chat.assistantId,
      title: chat.title,
      voiceStyle: chat.voiceStyle,
      topic: chat.topic,
      instructions: chat.instructions,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
```

#### Step 7: API Route (Server-side)

```typescript
// ✅ app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/config/di/container';
import { CreateChatUseCase } from '@/core/use-cases/chat/CreateChatUseCase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body
    const body = await request.json();

    // 3. Get use case from DI container
    const useCase = container.get(CreateChatUseCase);

    // 4. Execute
    const chat = await useCase.execute({
      userId: session.user.id,
      assistantId: body.assistantId,
      voiceStyle: body.voiceStyle,
      topic: body.topic,
      instructions: body.instructions,
    });

    // 5. Return response
    return NextResponse.json(
      {
        id: chat.id.toString(),
        title: chat.title,
        assistantId: chat.assistantId,
        voiceStyle: chat.voiceStyle,
        topic: chat.topic,
        instructions: chat.instructions,
        createdAt: chat.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Failed to create chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const useCase = container.get(GetUserChatsUseCase);
    const chats = await useCase.execute(session.user.id);

    return NextResponse.json(chats.map(/* map to DTO */));
  } catch (error) {
    console.error('Failed to get chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Step 8: React Hook (Presentation)

```typescript
// ✅ presentation/hooks/features/useChat.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatViewModel } from '@/presentation/view-models/ChatViewModel';

export function useChat() {
  const queryClient = useQueryClient();

  // Get all chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      return data.map(ChatViewModel.fromDTO);
    },
  });

  // Create chat mutation
  const createChatMutation = useMutation({
    mutationFn: async (params: {
      assistantId: string;
      voiceStyle: string;
      topic: string;
      instructions: string;
    }) => {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create chat');
      }

      return response.json();
    },
    onSuccess: (newChat) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['chats'] });

      // Or optimistic update
      queryClient.setQueryData(['chats'], (old: any[]) => [
        ChatViewModel.fromDTO(newChat),
        ...old,
      ]);
    },
  });

  return {
    chats: chats || [],
    isLoading,
    createChat: createChatMutation.mutate,
    isCreating: createChatMutation.isPending,
    error: createChatMutation.error,
  };
}
```

#### Step 9: Component (Pure UI)

```typescript
// ✅ presentation/components/features/chat/NewChatModal.tsx
import { useChat } from '@/presentation/hooks/features/useChat';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { useState } from 'react';

export function NewChatModal({ isOpen, onClose }: Props) {
  const { createChat, isCreating } = useChat();
  const [formData, setFormData] = useState({
    assistantId: '',
    voiceStyle: '',
    topic: '',
    instructions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createChat(formData, {
      onSuccess: () => {
        onClose();
        setFormData({ assistantId: '', voiceStyle: '', topic: '', instructions: '' });
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Voice Style"
          value={formData.voiceStyle}
          onChange={(e) => setFormData({ ...formData, voiceStyle: e.target.value })}
        />
        {/* ... other fields ... */}
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Chat'}
        </Button>
      </form>
    </Modal>
  );
}
```

---

## Example 2: Refactoring Voice Recording

### CURRENT IMPLEMENTATION

```typescript
// ❌ hooks/useVoiceRecording.ts (tightly coupled)
export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");

    const response = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: "whisper-1",
    });

    return response.text;
  };

  return { isRecording, transcribeAudio };
}
```

### PROPOSED IMPLEMENTATION

#### Step 1: Port Interface

```typescript
// ✅ core/ports/services/IVoiceTranscriber.ts
export interface IVoiceTranscriber {
  transcribe(audioBlob: Blob, options?: TranscribeOptions): Promise<string>;
}

export interface TranscribeOptions {
  language?: string;
  prompt?: string;
}
```

#### Step 2: Use Case

```typescript
// ✅ core/use-cases/voice/TranscribeVoiceUseCase.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/di/types';
import { IVoiceTranscriber } from '@/core/ports/services/IVoiceTranscriber';

@injectable()
export class TranscribeVoiceUseCase {
  constructor(
    @inject(TYPES.IVoiceTranscriber) private transcriber: IVoiceTranscriber
  ) {}

  async execute(audioBlob: Blob, language?: string): Promise<string> {
    if (audioBlob.size === 0) {
      throw new Error('Audio blob is empty');
    }

    if (audioBlob.size > 25 * 1024 * 1024) {
      throw new Error('Audio file too large (max 25MB)');
    }

    return await this.transcriber.transcribe(audioBlob, { language });
  }
}
```

#### Step 3: Adapter (OpenAI Implementation)

```typescript
// ✅ infrastructure/voice-providers/openai/OpenAIVoiceTranscriber.ts
import { injectable } from 'inversify';
import OpenAI from 'openai';
import { IVoiceTranscriber, TranscribeOptions } from '@/core/ports/services/IVoiceTranscriber';

@injectable()
export class OpenAIVoiceTranscriber implements IVoiceTranscriber {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribe(audioBlob: Blob, options?: TranscribeOptions): Promise<string> {
    const file = new File([audioBlob], 'recording.webm', { type: audioBlob.type });

    const response = await this.client.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: options?.language,
      prompt: options?.prompt,
    });

    return response.text;
  }
}
```

#### Step 4: Alternative Adapter (ElevenLabs)

```typescript
// ✅ infrastructure/voice-providers/elevenlabs/ElevenLabsVoiceTranscriber.ts
import { injectable } from 'inversify';
import { IVoiceTranscriber } from '@/core/ports/services/IVoiceTranscriber';

@injectable()
export class ElevenLabsVoiceTranscriber implements IVoiceTranscriber {
  async transcribe(audioBlob: Blob): Promise<string> {
    // ElevenLabs implementation
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: formData,
    });

    const data = await response.json();
    return data.text;
  }
}
```

#### Step 5: DI Configuration (Easy Provider Switching)

```typescript
// ✅ config/di/bindings.ts
import { Container } from 'inversify';
import { TYPES } from './types';
import { IVoiceTranscriber } from '@/core/ports/services/IVoiceTranscriber';
import { OpenAIVoiceTranscriber } from '@/infrastructure/voice-providers/openai/OpenAIVoiceTranscriber';
import { ElevenLabsVoiceTranscriber } from '@/infrastructure/voice-providers/elevenlabs/ElevenLabsVoiceTranscriber';

const container = new Container();

// Switch providers by changing one line!
const VOICE_PROVIDER = process.env.VOICE_PROVIDER || 'openai';

if (VOICE_PROVIDER === 'openai') {
  container.bind<IVoiceTranscriber>(TYPES.IVoiceTranscriber).to(OpenAIVoiceTranscriber);
} else if (VOICE_PROVIDER === 'elevenlabs') {
  container.bind<IVoiceTranscriber>(TYPES.IVoiceTranscriber).to(ElevenLabsVoiceTranscriber);
}

export { container };
```

#### Step 6: API Route

```typescript
// ✅ app/api/voice/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/config/di/container';
import { TranscribeVoiceUseCase } from '@/core/use-cases/voice/TranscribeVoiceUseCase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const audioBlob = await audioFile.arrayBuffer();
    const blob = new Blob([audioBlob], { type: audioFile.type });

    const useCase = container.get(TranscribeVoiceUseCase);
    const text = await useCase.execute(blob);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}
```

#### Step 7: React Hook

```typescript
// ✅ presentation/hooks/features/useVoiceRecording.ts
import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const transcribeMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      return data.text;
    },
  });

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      transcribeMutation.mutate(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    transcription: transcribeMutation.data,
    isTranscribing: transcribeMutation.isPending,
  };
}
```

---

## Benefits Summary

### Before (Current)
- ❌ Components tightly coupled to OpenAI
- ❌ Can't swap providers without rewriting code
- ❌ Hard to test (mocking OpenAI client)
- ❌ Business logic scattered everywhere
- ❌ No validation layer
- ❌ Client-side API calls (security risk)

### After (Proposed)
- ✅ Components depend on abstractions
- ✅ Swap providers by changing DI configuration
- ✅ Easy to test (mock interfaces)
- ✅ Business logic in use-cases
- ✅ Validation in domain layer
- ✅ Server-side API calls (secure)

---

## Testing Examples

### Testing Use Case (Unit Test)

```typescript
// tests/unit/use-cases/TranscribeVoiceUseCase.test.ts
import { TranscribeVoiceUseCase } from '@/core/use-cases/voice/TranscribeVoiceUseCase';
import { IVoiceTranscriber } from '@/core/ports/services/IVoiceTranscriber';

describe('TranscribeVoiceUseCase', () => {
  let useCase: TranscribeVoiceUseCase;
  let mockTranscriber: jest.Mocked<IVoiceTranscriber>;

  beforeEach(() => {
    mockTranscriber = {
      transcribe: jest.fn(),
    };
    useCase = new TranscribeVoiceUseCase(mockTranscriber);
  });

  it('should transcribe audio successfully', async () => {
    const audioBlob = new Blob(['test'], { type: 'audio/webm' });
    mockTranscriber.transcribe.mockResolvedValue('Hello world');

    const result = await useCase.execute(audioBlob);

    expect(result).toBe('Hello world');
    expect(mockTranscriber.transcribe).toHaveBeenCalledWith(audioBlob, {});
  });

  it('should throw error for empty blob', async () => {
    const emptyBlob = new Blob([], { type: 'audio/webm' });

    await expect(useCase.execute(emptyBlob)).rejects.toThrow('Audio blob is empty');
  });
});
```

### Testing Component (Integration Test)

```typescript
// tests/integration/components/NewChatModal.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewChatModal } from '@/presentation/components/features/chat/NewChatModal';
import { QueryClientProvider } from '@tanstack/react-query';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

describe('NewChatModal', () => {
  it('should create chat when form is submitted', async () => {
    const onClose = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <NewChatModal isOpen={true} onClose={onClose} />
      </QueryClientProvider>
    );

    // Fill form
    await userEvent.type(screen.getByLabelText('Voice Style'), 'Warm');
    await userEvent.type(screen.getByLabelText('Topic'), 'Coding');

    // Submit
    await userEvent.click(screen.getByText('Create Chat'));

    // Assert
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
```

---

## Migration Checklist

### Phase 1: Foundation
- [ ] Create `core/domain/entities` folder
- [ ] Create `core/domain/value-objects` folder
- [ ] Define entity classes (Chat, Message, User, Assistant)
- [ ] Create `core/ports` folder
- [ ] Define repository interfaces
- [ ] Define service interfaces
- [ ] Set up DI container (inversify)

### Phase 2: Use Cases
- [ ] Create `core/use-cases` folder
- [ ] Implement CreateChatUseCase
- [ ] Implement SendMessageUseCase
- [ ] Implement GetChatHistoryUseCase
- [ ] Implement TranscribeVoiceUseCase
- [ ] Add validation layer

### Phase 3: Infrastructure
- [ ] Set up Prisma
- [ ] Create database schema
- [ ] Implement PrismaChatRepository
- [ ] Implement PrismaUserRepository
- [ ] Create OpenAI adapters (server-side)
- [ ] Create mappers (domain ↔ persistence)

### Phase 4: API Routes
- [ ] Create `/api/chats` routes
- [ ] Create `/api/chats/[id]/messages` routes
- [ ] Create `/api/voice/transcribe` route
- [ ] Create `/api/voice/synthesize` route
- [ ] Add authentication middleware
- [ ] Add rate limiting

### Phase 5: Presentation
- [ ] Set up TanStack Query
- [ ] Refactor hooks to use API routes
- [ ] Remove direct OpenAI calls from client
- [ ] Update components to use new hooks
- [ ] Add error boundaries
- [ ] Add loading states

### Phase 6: Testing
- [ ] Set up Vitest
- [ ] Write unit tests for use-cases
- [ ] Write integration tests for API routes
- [ ] Set up MSW for API mocking
- [ ] Write component tests
- [ ] Set up Playwright for E2E

---

## Next Steps

1. **Start Small**: Pick ONE feature to refactor (e.g., chat creation)
2. **Follow the Pattern**: Use the examples above as templates
3. **Test Each Layer**: Write tests as you go
4. **Iterate**: Refactor incrementally, don't rewrite everything at once
5. **Document**: Keep architecture docs updated

**Remember:** The goal is not perfection, but **maintainability, testability, and scalability**.
