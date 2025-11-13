# Mina - Architecture Assessment & Recommendations

**Assessed by:** Principal Software Engineer & Solution Architect
**Date:** 2025-11-12
**Project:** Mina AI Voice Assistant

---

## Executive Summary

### Current State: ⭐⭐⭐☆☆ (3/5)

**Strengths:**
- Clean component structure with good separation of concerns
- Modern Next.js 16 with App Router
- Full TypeScript coverage
- Well-organized folder structure
- Custom hooks for state management

**Critical Issues:**
- ❌ **High coupling** between components and business logic
- ❌ **No clear domain separation** (mixing UI, data, and business logic)
- ❌ **Tight dependency on OpenAI** (vendor lock-in)
- ❌ **Client-side API calls** (security risk)
- ❌ **No data persistence layer** (all in-memory)
- ❌ **Limited testability** (no dependency injection)
- ❌ **LocalStorage state management** (not scalable)

---

## Modularity Analysis

### Current Architecture Pattern: **Component-Centric Monolith**

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                        │
│  (Mixed: UI + Business Logic + API Calls + State)           │
├─────────────────────────────────────────────────────────────┤
│  Custom Hooks (Partial abstraction)                         │
├─────────────────────────────────────────────────────────────┤
│  OpenAI Client (Direct dependency)                          │
├─────────────────────────────────────────────────────────────┤
│  LocalStorage (Ephemeral state)                             │
└─────────────────────────────────────────────────────────────┘
```

**Problems:**
1. Components directly call OpenAI APIs
2. No abstraction layer for AI providers
3. Business logic scattered across hooks and components
4. No repository pattern for data access
5. Hard to swap implementations (OpenAI → Anthropic, LocalStorage → Database)

---

## Recommended Architecture: **Layered Hexagonal Architecture**

### Target State: ⭐⭐⭐⭐⭐ (5/5)

```
┌───────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Components │  │    Pages     │  │   Layouts    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬──────────────────────────────────────┘
                             │ Uses
┌────────────────────────────▼──────────────────────────────────────┐
│                    APPLICATION LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Use Cases   │  │   Services   │  │   View Models│            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬──────────────────────────────────────┘
                             │ Depends on
┌────────────────────────────▼──────────────────────────────────────┐
│                      DOMAIN LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Entities   │  │   Interfaces │  │  Domain Logic│            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬──────────────────────────────────────┘
                             │ Implemented by
┌────────────────────────────▼──────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Repositories │  │   API Clients│  │   Adapters   │            │
│  │  (Database)  │  │   (OpenAI)   │  │  (External)  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└───────────────────────────────────────────────────────────────────┘
```

---

## Proposed Modular File Structure

```
src/
├── app/                              # Next.js App Router (Presentation)
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── chats/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/                          # Server-side API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── chats/
│   │   │   ├── route.ts              # GET /api/chats, POST /api/chats
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE
│   │   │       └── messages/route.ts
│   │   ├── voice/
│   │   │   ├── transcribe/route.ts   # POST /api/voice/transcribe
│   │   │   └── synthesize/route.ts   # POST /api/voice/synthesize
│   │   └── ai/
│   │       └── completion/route.ts   # POST /api/ai/completion
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── core/                             # DOMAIN LAYER (Business Logic)
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Chat.ts
│   │   │   ├── Message.ts
│   │   │   ├── Assistant.ts
│   │   │   └── VoiceSession.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── ChatId.ts
│   │   │   ├── MessageContent.ts
│   │   │   └── AudioBlob.ts
│   │   │
│   │   └── events/
│   │       ├── MessageSent.ts
│   │       ├── ChatCreated.ts
│   │       └── VoiceRecorded.ts
│   │
│   ├── use-cases/                    # APPLICATION LAYER
│   │   ├── chat/
│   │   │   ├── CreateChatUseCase.ts
│   │   │   ├── SendMessageUseCase.ts
│   │   │   ├── GetChatHistoryUseCase.ts
│   │   │   └── DeleteChatUseCase.ts
│   │   │
│   │   ├── voice/
│   │   │   ├── RecordVoiceUseCase.ts
│   │   │   ├── TranscribeVoiceUseCase.ts
│   │   │   └── SynthesizeSpeechUseCase.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── GenerateResponseUseCase.ts
│   │   │   └── StreamResponseUseCase.ts
│   │   │
│   │   └── auth/
│   │       ├── LoginUseCase.ts
│   │       └── LogoutUseCase.ts
│   │
│   └── ports/                        # INTERFACES (Dependency Inversion)
│       ├── repositories/
│       │   ├── IChatRepository.ts
│       │   ├── IUserRepository.ts
│       │   └── IMessageRepository.ts
│       │
│       ├── services/
│       │   ├── IAIProvider.ts
│       │   ├── IVoiceProvider.ts
│       │   ├── IStorageProvider.ts
│       │   └── IAuthProvider.ts
│       │
│       └── events/
│           └── IEventBus.ts
│
├── infrastructure/                   # INFRASTRUCTURE LAYER (Adapters)
│   ├── repositories/
│   │   ├── prisma/
│   │   │   ├── PrismaChatRepository.ts
│   │   │   ├── PrismaUserRepository.ts
│   │   │   └── schema.prisma
│   │   │
│   │   └── in-memory/
│   │       ├── InMemoryChatRepository.ts
│   │       └── InMemoryUserRepository.ts
│   │
│   ├── ai-providers/
│   │   ├── openai/
│   │   │   ├── OpenAIProvider.ts
│   │   │   ├── OpenAIConfig.ts
│   │   │   └── OpenAIMapper.ts
│   │   │
│   │   ├── anthropic/
│   │   │   └── AnthropicProvider.ts
│   │   │
│   │   └── gemini/
│   │       └── GeminiProvider.ts
│   │
│   ├── voice-providers/
│   │   ├── openai/
│   │   │   └── OpenAIVoiceProvider.ts
│   │   │
│   │   └── elevenlabs/
│   │       └── ElevenLabsProvider.ts
│   │
│   ├── storage/
│   │   ├── LocalStorageProvider.ts
│   │   ├── SupabaseStorageProvider.ts
│   │   └── S3StorageProvider.ts
│   │
│   └── events/
│       ├── InMemoryEventBus.ts
│       └── RedisEventBus.ts
│
├── presentation/                     # PRESENTATION LAYER
│   ├── components/
│   │   ├── ui/                       # Pure UI components (shadcn-style)
│   │   │   ├── button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.stories.tsx
│   │   │   ├── input/
│   │   │   ├── modal/
│   │   │   └── avatar/
│   │   │
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── chat/
│   │   │   │   ├── ChatList/
│   │   │   │   │   ├── ChatList.tsx
│   │   │   │   │   ├── ChatListItem.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── ChatMessages/
│   │   │   │   │   ├── ChatMessages.tsx
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── ChatInput/
│   │   │   │       ├── ChatInput.tsx
│   │   │   │       ├── VoiceButton.tsx
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── assistant/
│   │   │   │   ├── AssistantCard/
│   │   │   │   ├── AssistantAvatar/
│   │   │   │   └── AssistantSelector/
│   │   │   │
│   │   │   └── voice/
│   │   │       ├── VoiceRecorder/
│   │   │       └── VoicePlayer/
│   │   │
│   │   └── layouts/
│   │       ├── DashboardLayout/
│   │       ├── AuthLayout/
│   │       └── ChatLayout/
│   │
│   ├── hooks/
│   │   ├── ui/
│   │   │   ├── useAnimation.ts
│   │   │   ├── useModal.ts
│   │   │   └── useToast.ts
│   │   │
│   │   └── features/
│   │       ├── useChat.ts            # Facade over use-cases
│   │       ├── useVoice.ts
│   │       └── useAuth.ts
│   │
│   ├── view-models/
│   │   ├── ChatViewModel.ts
│   │   ├── MessageViewModel.ts
│   │   └── AssistantViewModel.ts
│   │
│   └── providers/
│       ├── AppProviders.tsx
│       ├── QueryProvider.tsx
│       └── ThemeProvider.tsx
│
├── shared/                           # SHARED KERNEL
│   ├── lib/
│   │   ├── utils/
│   │   │   ├── cn.ts                 # classNames utility
│   │   │   ├── date.ts
│   │   │   ├── validation.ts
│   │   │   └── logger.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── app.ts
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   │
│   │   └── errors/
│   │       ├── AppError.ts
│   │       ├── ValidationError.ts
│   │       └── NetworkError.ts
│   │
│   └── types/
│       ├── common.ts
│       └── api.ts
│
├── config/                           # CONFIGURATION
│   ├── di/                           # Dependency Injection
│   │   ├── container.ts
│   │   ├── bindings.ts
│   │   └── types.ts
│   │
│   ├── env/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── schema.ts
│   │
│   └── providers/
│       ├── ai.config.ts
│       ├── database.config.ts
│       └── storage.config.ts
│
└── tests/                            # TESTING
    ├── unit/
    ├── integration/
    ├── e2e/
    └── fixtures/
```

---

## Key Architectural Principles

### 1. **Dependency Inversion Principle (DIP)**

**Before:**
```typescript
// ❌ Component directly depends on OpenAI
import { openai } from '@/lib/openai';

function ChatComponent() {
  const sendMessage = async (text: string) => {
    const response = await openai.chat.completions.create({...});
  };
}
```

**After:**
```typescript
// ✅ Component depends on abstraction
import { useAI } from '@/presentation/hooks/features/useAI';

function ChatComponent() {
  const { sendMessage } = useAI();
  // Implementation details hidden
}

// Hook delegates to use-case
function useAI() {
  const sendMessage = async (text: string) => {
    const useCase = container.get(SendMessageUseCase);
    return await useCase.execute(text);
  };
}

// Use-case depends on interface (port)
class SendMessageUseCase {
  constructor(private aiProvider: IAIProvider) {}

  async execute(text: string) {
    return this.aiProvider.generateResponse(text);
  }
}

// Concrete implementation (adapter)
class OpenAIProvider implements IAIProvider {
  async generateResponse(text: string) {
    // OpenAI-specific logic
  }
}
```

### 2. **Single Responsibility Principle (SRP)**

Each module has ONE reason to change:
- **Components**: Only change when UI needs change
- **Use Cases**: Only change when business rules change
- **Repositories**: Only change when data storage changes
- **Providers**: Only change when external API changes

### 3. **Open/Closed Principle (OCP)**

Open for extension, closed for modification:
- Add new AI providers without changing use-cases
- Add new storage backends without changing business logic
- Add new UI frameworks without changing domain

### 4. **Interface Segregation Principle (ISP)**

Clients shouldn't depend on interfaces they don't use:
```typescript
// ❌ Fat interface
interface IAIProvider {
  generateText(prompt: string): Promise<string>;
  generateImage(prompt: string): Promise<string>;
  generateAudio(text: string): Promise<Blob>;
  transcribeAudio(blob: Blob): Promise<string>;
}

// ✅ Segregated interfaces
interface ITextGenerator {
  generate(prompt: string): Promise<string>;
}

interface IVoiceTranscriber {
  transcribe(blob: Blob): Promise<string>;
}

interface IVoiceSynthesizer {
  synthesize(text: string): Promise<Blob>;
}
```

### 5. **Dependency Injection (DI)**

Use a DI container (tsyringe, inversify, or awilix):
```typescript
// config/di/container.ts
import { Container } from 'inversify';
import { TYPES } from './types';

const container = new Container();

// Bind interfaces to implementations
container.bind<IAIProvider>(TYPES.IAIProvider).to(OpenAIProvider);
container.bind<IChatRepository>(TYPES.IChatRepository).to(PrismaChatRepository);
container.bind<IVoiceProvider>(TYPES.IVoiceProvider).to(OpenAIVoiceProvider);

export { container };
```

---

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Create domain entities and value objects
2. Define port interfaces (repositories, services)
3. Set up DI container
4. Implement use-cases for core features

### Phase 2: Infrastructure (Week 2-3)
1. Create adapters for OpenAI (move from client to server)
2. Set up Prisma with PostgreSQL/MongoDB
3. Implement repository pattern
4. Create API routes

### Phase 3: Presentation (Week 3-4)
1. Refactor components to use view models
2. Update hooks to use use-cases
3. Remove direct dependencies on infrastructure
4. Add error boundaries

### Phase 4: Testing & Optimization (Week 4-5)
1. Add unit tests for use-cases
2. Add integration tests for repositories
3. Add E2E tests for critical flows
4. Performance optimization

---

## Best Practices for Adding New Features

### Example: Adding "Chat Export" Feature

#### Step 1: Define Domain Entity (if needed)
```typescript
// core/domain/entities/ChatExport.ts
export class ChatExport {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly format: 'json' | 'pdf' | 'txt',
    public readonly createdAt: Date
  ) {}
}
```

#### Step 2: Create Port Interface
```typescript
// core/ports/services/IExportService.ts
export interface IExportService {
  exportChat(chatId: string, format: 'json' | 'pdf' | 'txt'): Promise<Blob>;
}
```

#### Step 3: Implement Use Case
```typescript
// core/use-cases/chat/ExportChatUseCase.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/di/types';

@injectable()
export class ExportChatUseCase {
  constructor(
    @inject(TYPES.IChatRepository) private chatRepo: IChatRepository,
    @inject(TYPES.IExportService) private exportService: IExportService
  ) {}

  async execute(chatId: string, format: 'json' | 'pdf' | 'txt'): Promise<Blob> {
    // 1. Validate input
    if (!chatId) throw new ValidationError('Chat ID required');

    // 2. Get chat from repository
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) throw new NotFoundError('Chat not found');

    // 3. Delegate to export service
    return await this.exportService.exportChat(chatId, format);
  }
}
```

#### Step 4: Create Adapter (Infrastructure)
```typescript
// infrastructure/export/PDFExportService.ts
export class PDFExportService implements IExportService {
  async exportChat(chatId: string, format: string): Promise<Blob> {
    // Implementation using pdf-lib or similar
  }
}
```

#### Step 5: Register in DI Container
```typescript
// config/di/bindings.ts
container.bind<IExportService>(TYPES.IExportService).to(PDFExportService);
container.bind<ExportChatUseCase>(ExportChatUseCase).toSelf();
```

#### Step 6: Create API Route
```typescript
// app/api/chats/[id]/export/route.ts
import { container } from '@/config/di/container';
import { ExportChatUseCase } from '@/core/use-cases/chat/ExportChatUseCase';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { format } = await request.json();

  const useCase = container.get(ExportChatUseCase);
  const blob = await useCase.execute(params.id, format);

  return new Response(blob, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="chat-${params.id}.pdf"`
    }
  });
}
```

#### Step 7: Create Presentation Hook
```typescript
// presentation/hooks/features/useChatExport.ts
export function useChatExport() {
  const exportChat = async (chatId: string, format: 'pdf' | 'json') => {
    const response = await fetch(`/api/chats/${chatId}/export`, {
      method: 'POST',
      body: JSON.stringify({ format })
    });

    const blob = await response.blob();
    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chatId}.${format}`;
    a.click();
  };

  return { exportChat };
}
```

#### Step 8: Use in Component
```typescript
// presentation/components/features/chat/ChatMessages/ChatMessages.tsx
import { useChatExport } from '@/presentation/hooks/features/useChatExport';

export function ChatMessages({ chatId }: Props) {
  const { exportChat } = useChatExport();

  return (
    <div>
      {/* ... messages ... */}
      <Button onClick={() => exportChat(chatId, 'pdf')}>
        Export as PDF
      </Button>
    </div>
  );
}
```

---

## Testing Strategy

### Unit Tests (Use Cases)
```typescript
// tests/unit/use-cases/ExportChatUseCase.test.ts
describe('ExportChatUseCase', () => {
  let useCase: ExportChatUseCase;
  let mockChatRepo: jest.Mocked<IChatRepository>;
  let mockExportService: jest.Mocked<IExportService>;

  beforeEach(() => {
    mockChatRepo = createMock<IChatRepository>();
    mockExportService = createMock<IExportService>();
    useCase = new ExportChatUseCase(mockChatRepo, mockExportService);
  });

  it('should export chat as PDF', async () => {
    // Arrange
    const chatId = 'chat-123';
    const mockChat = new Chat(chatId, 'Test Chat', []);
    mockChatRepo.findById.mockResolvedValue(mockChat);
    mockExportService.exportChat.mockResolvedValue(new Blob());

    // Act
    const result = await useCase.execute(chatId, 'pdf');

    // Assert
    expect(mockChatRepo.findById).toHaveBeenCalledWith(chatId);
    expect(mockExportService.exportChat).toHaveBeenCalledWith(chatId, 'pdf');
    expect(result).toBeInstanceOf(Blob);
  });

  it('should throw error if chat not found', async () => {
    // Arrange
    mockChatRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('invalid', 'pdf'))
      .rejects
      .toThrow(NotFoundError);
  });
});
```

### Integration Tests (API Routes)
```typescript
// tests/integration/api/chats/export.test.ts
describe('POST /api/chats/[id]/export', () => {
  it('should return PDF blob', async () => {
    const response = await fetch('/api/chats/chat-123/export', {
      method: 'POST',
      body: JSON.stringify({ format: 'pdf' })
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');

    const blob = await response.blob();
    expect(blob.size).toBeGreaterThan(0);
  });
});
```

---

## Technology Recommendations

### 1. State Management
**Current:** LocalStorage + React Context
**Recommended:**
- **TanStack Query (React Query)** for server state
- **Zustand** or **Jotai** for client state
- **Zod** for runtime validation

### 2. Database
**Recommended:**
- **Prisma** + **PostgreSQL** (relational, complex queries)
- **Prisma** + **MongoDB** (document-based, flexible schema)
- **Supabase** (PostgreSQL + Auth + Realtime)

### 3. Authentication
**Recommended:**
- **NextAuth.js v5** (OAuth + JWT)
- **Clerk** (Managed auth, great DX)
- **Supabase Auth** (if using Supabase)

### 4. Real-time Features
**Recommended:**
- **Pusher** or **Ably** (managed WebSockets)
- **Supabase Realtime** (if using Supabase)
- **Socket.io** (self-hosted)

### 5. Testing
**Recommended:**
- **Vitest** (unit tests, faster than Jest)
- **Playwright** (E2E tests)
- **Testing Library** (React component tests)
- **MSW** (API mocking)

### 6. Dependency Injection
**Recommended:**
- **inversify** (mature, TypeScript-first)
- **tsyringe** (lightweight, Microsoft)
- **awilix** (simple, container-based)

### 7. Validation
**Recommended:**
- **Zod** (runtime schema validation)
- **class-validator** (decorator-based)

### 8. API Layer
**Recommended:**
- **tRPC** (type-safe APIs, no codegen)
- **Next.js API Routes** (current, simple)
- **GraphQL** (if complex data requirements)

---

## Performance Optimization Strategies

### 1. Code Splitting
```typescript
// Lazy load heavy components
const ChatMessages = lazy(() => import('./ChatMessages'));
const VoiceBrowser = lazy(() => import('./VoiceBrowser'));

<Suspense fallback={<Skeleton />}>
  <ChatMessages />
</Suspense>
```

### 2. Virtual Scrolling
```typescript
// For long message lists
import { useVirtualizer } from '@tanstack/react-virtual';

function MessageList({ messages }) {
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  return (
    <div ref={parentRef}>
      {virtualizer.getVirtualItems().map((virtualRow) => (
        <Message key={virtualRow.index} {...messages[virtualRow.index]} />
      ))}
    </div>
  );
}
```

### 3. Debouncing & Throttling
```typescript
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((query: string) => {
  // Search logic
}, 300);
```

### 4. Optimistic Updates
```typescript
const { mutate } = useMutation({
  mutationFn: sendMessage,
  onMutate: async (newMessage) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries(['messages', chatId]);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['messages', chatId]);

    // Optimistically update
    queryClient.setQueryData(['messages', chatId], (old) =>
      [...old, newMessage]
    );

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['messages', chatId], context.previous);
  },
});
```

### 5. Server-Side Rendering (SSR)
```typescript
// For initial page load performance
export async function generateMetadata({ params }) {
  const chat = await getChatById(params.id);
  return {
    title: chat.title,
    description: chat.lastMessage,
  };
}

export default async function ChatPage({ params }) {
  const initialData = await getChatMessages(params.id);

  return <ChatMessages initialData={initialData} />;
}
```

---

## Security Checklist

### API Security
- [ ] Move all OpenAI calls to server-side API routes
- [ ] Remove `dangerouslyAllowBrowser: true`
- [ ] Implement rate limiting (upstash/ratelimit)
- [ ] Add API key validation middleware
- [ ] Sanitize user inputs (XSS prevention)
- [ ] Implement CSRF protection
- [ ] Use environment variables for secrets
- [ ] Add request logging and monitoring

### Authentication
- [ ] Implement proper OAuth flow (not mock)
- [ ] Use secure session management (httpOnly cookies)
- [ ] Implement refresh token rotation
- [ ] Add password hashing (bcrypt/argon2)
- [ ] Enable 2FA support
- [ ] Add account verification (email)

### Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS in production
- [ ] Implement proper CORS policies
- [ ] Add Content Security Policy (CSP)
- [ ] Sanitize database queries (prevent SQL injection)
- [ ] Add data retention policies

---

## Monitoring & Observability

### Recommended Tools
1. **Error Tracking:** Sentry
2. **Analytics:** PostHog, Mixpanel
3. **Performance:** Vercel Analytics, New Relic
4. **Logging:** Winston, Pino
5. **Uptime:** UptimeRobot, Better Uptime

### Implementation
```typescript
// shared/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Use in use-cases
logger.info({ chatId, userId }, 'Chat created');
logger.error({ error, chatId }, 'Failed to send message');
```

---

## Scalability Roadmap

### Vertical Scaling (Single Server)
- Optimize database queries (indexes, query optimization)
- Implement caching (Redis)
- Use CDN for static assets
- Enable HTTP/2 and compression

### Horizontal Scaling (Multiple Servers)
- Stateless API design
- Session storage in Redis
- Database read replicas
- Load balancer (AWS ALB, Cloudflare)
- Message queue for async tasks (Bull, BullMQ)

### Microservices (Future)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Auth      │     │   Chat      │     │   Voice     │
│  Service    │────▶│  Service    │────▶│  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   API Gateway  │
                    └────────────────┘
```

---

## Summary: Action Items

### Immediate (Week 1)
1. ✅ Move OpenAI API calls to server-side routes
2. ✅ Set up Prisma with PostgreSQL
3. ✅ Implement repository pattern for data access
4. ✅ Create use-case layer for business logic
5. ✅ Set up dependency injection

### Short-term (Month 1)
1. ✅ Implement real authentication (NextAuth.js)
2. ✅ Add comprehensive error handling
3. ✅ Set up testing infrastructure
4. ✅ Implement rate limiting
5. ✅ Add monitoring and logging

### Long-term (Quarter 1)
1. ✅ Implement real-time features (WebSockets)
2. ✅ Add message search functionality
3. ✅ Implement voice calling (WebRTC)
4. ✅ Add multi-language support (i18n)
5. ✅ Performance optimization (caching, CDN)

---

**Next Steps:** Review this architecture document, prioritize based on business needs, and start with Phase 1 migration. Focus on small, incremental changes to maintain stability while improving modularity.
