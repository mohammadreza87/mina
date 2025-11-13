# Mina - Recommended Project Structure

## Quick Reference: Where to Put New Code

### 🎯 I want to add a new **Business Rule** (e.g., "Users can't create more than 10 chats")
**Location:** `core/domain/entities/Chat.ts` or `core/use-cases/chat/CreateChatUseCase.ts`

```typescript
// core/use-cases/chat/CreateChatUseCase.ts
async execute(dto: CreateChatDTO): Promise<Chat> {
  const existingChats = await this.chatRepo.findByUserId(dto.userId);

  if (existingChats.length >= 10) {
    throw new BusinessRuleError('Maximum chat limit reached');
  }

  // ... create chat
}
```

---

### 🗄️ I want to add a new **Database Operation** (e.g., "Find chats by assistant ID")
**Location:** `core/ports/repositories/IChatRepository.ts` (interface) + `infrastructure/repositories/prisma/PrismaChatRepository.ts` (implementation)

```typescript
// 1. Add to interface
export interface IChatRepository {
  findByAssistantId(assistantId: string): Promise<Chat[]>;
}

// 2. Implement in adapter
export class PrismaChatRepository implements IChatRepository {
  async findByAssistantId(assistantId: string): Promise<Chat[]> {
    const records = await this.prisma.chat.findMany({
      where: { assistantId }
    });
    return records.map(ChatMapper.toDomain);
  }
}
```

---

### 🤖 I want to add a new **AI Provider** (e.g., "Add Anthropic Claude support")
**Location:** `infrastructure/ai-providers/anthropic/`

```
infrastructure/ai-providers/anthropic/
├── AnthropicProvider.ts          # Implements IAIProvider
├── AnthropicConfig.ts            # Configuration
└── AnthropicMapper.ts            # DTO mapping
```

```typescript
// infrastructure/ai-providers/anthropic/AnthropicProvider.ts
@injectable()
export class AnthropicProvider implements IAIProvider {
  async generateResponse(prompt: string): Promise<string> {
    // Anthropic API integration
  }
}

// config/di/bindings.ts - Switch provider here
container.bind<IAIProvider>(TYPES.IAIProvider).to(AnthropicProvider);
```

---

### 🎨 I want to add a new **UI Component** (e.g., "Add a settings panel")
**Location:**
- Pure UI: `presentation/components/ui/settings-panel/`
- Feature-specific: `presentation/components/features/settings/`

```
presentation/components/features/settings/
├── SettingsPanel/
│   ├── SettingsPanel.tsx
│   ├── SettingsPanel.test.tsx
│   ├── SettingsSidebar.tsx
│   └── index.ts
```

---

### 🔌 I want to add a new **API Endpoint** (e.g., "GET /api/chats/[id]/export")
**Location:** `app/api/chats/[id]/export/route.ts`

```typescript
// app/api/chats/[id]/export/route.ts
import { container } from '@/config/di/container';
import { ExportChatUseCase } from '@/core/use-cases/chat/ExportChatUseCase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const useCase = container.get(ExportChatUseCase);
  const result = await useCase.execute(params.id);

  return NextResponse.json(result);
}
```

---

### 🎣 I want to add a new **React Hook** (e.g., "Hook for managing notifications")
**Location:**
- UI Hook: `presentation/hooks/ui/useNotifications.ts`
- Feature Hook: `presentation/hooks/features/useChat.ts`

```typescript
// presentation/hooks/ui/useNotifications.ts
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message: string) => {
    // UI logic only
  };

  return { notifications, addNotification };
}

// presentation/hooks/features/useChat.ts
export function useChat() {
  const createChat = async (data: CreateChatDTO) => {
    // Calls API route (which calls use-case)
    const response = await fetch('/api/chats', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return { createChat };
}
```

---

### 📊 I want to add a new **Type/Interface** (e.g., "Type for voice settings")
**Location:**
- Domain types: `core/domain/entities/` or `core/domain/value-objects/`
- Shared types: `shared/types/`
- DTO types: With use-cases or API routes

```typescript
// core/domain/value-objects/VoiceSettings.ts
export class VoiceSettings {
  constructor(
    public readonly style: string,
    public readonly pitch: number,
    public readonly speed: number
  ) {
    this.validate();
  }

  private validate() {
    if (this.pitch < 0.5 || this.pitch > 2) {
      throw new Error('Pitch must be between 0.5 and 2');
    }
  }
}
```

---

### 🔧 I want to add a new **Utility Function** (e.g., "Format dates")
**Location:** `shared/lib/utils/`

```
shared/lib/utils/
├── date.ts         # formatDate(), isToday(), etc.
├── string.ts       # capitalize(), truncate(), etc.
├── validation.ts   # isEmail(), isURL(), etc.
└── logger.ts       # log(), error(), warn()
```

---

### 🧪 I want to add **Tests**
**Location:** `tests/` (mirrors source structure)

```
tests/
├── unit/
│   ├── core/
│   │   └── use-cases/
│   │       └── CreateChatUseCase.test.ts
│   └── infrastructure/
│       └── repositories/
│           └── PrismaChatRepository.test.ts
│
├── integration/
│   └── api/
│       └── chats/
│           └── route.test.ts
│
├── e2e/
│   └── chat-flow.spec.ts
│
└── fixtures/
    ├── chats.ts
    └── users.ts
```

---

## Decision Tree: Where Does My Code Go?

```
┌─────────────────────────────────────────────────────────────┐
│ What are you adding?                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    ┌─────▼──────┐          ┌──────▼─────┐
    │ UI-related │          │ Non-UI     │
    └─────┬──────┘          └──────┬─────┘
          │                        │
    ┌─────▼─────────────┐    ┌─────▼──────────────────┐
    │ Pure UI component │    │ Business logic?        │
    │ (buttons, inputs) │    └─────┬──────────────────┘
    └─────┬─────────────┘          │
          │                  ┌─────┴──────┐
          │                  │            │
    presentation/      ┌─────▼──────┐  ┌─▼────────────┐
    components/ui/     │ Yes        │  │ No           │
                       └─────┬──────┘  └─┬────────────┘
                             │           │
                    ┌────────▼──────┐    │
                    │ core/         │    │
                    │ use-cases/    │    │
                    └───────────────┘    │
                                         │
                        ┌────────────────▼───────────────┐
                        │ External integration?          │
                        └────────┬───────────────────────┘
                                 │
                        ┌────────┴──────┐
                        │               │
                  ┌─────▼─────┐   ┌────▼──────────┐
                  │ Yes       │   │ No            │
                  └─────┬─────┘   └────┬──────────┘
                        │              │
              ┌─────────▼────────┐     │
              │ infrastructure/  │     │
              │ (adapters)       │     │
              └──────────────────┘     │
                                       │
                              ┌────────▼─────────┐
                              │ shared/lib/      │
                              │ (utilities)      │
                              └──────────────────┘
```

---

## File Organization Patterns

### Pattern 1: Feature Modules (Recommended)

```
src/
├── core/
│   ├── chat/                    # Chat feature module
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Chat.ts
│   │   │   │   └── Message.ts
│   │   │   └── value-objects/
│   │   │       └── ChatId.ts
│   │   ├── use-cases/
│   │   │   ├── CreateChatUseCase.ts
│   │   │   ├── SendMessageUseCase.ts
│   │   │   └── GetChatHistoryUseCase.ts
│   │   └── ports/
│   │       └── IChatRepository.ts
│   │
│   ├── voice/                   # Voice feature module
│   │   ├── domain/
│   │   ├── use-cases/
│   │   └── ports/
│   │
│   └── auth/                    # Auth feature module
│       ├── domain/
│       ├── use-cases/
│       └── ports/
│
├── infrastructure/
│   ├── chat/
│   │   └── PrismaChatRepository.ts
│   ├── voice/
│   │   └── OpenAIVoiceProvider.ts
│   └── auth/
│       └── NextAuthProvider.ts
│
└── presentation/
    ├── features/
    │   ├── chat/
    │   │   ├── ChatList/
    │   │   ├── ChatMessages/
    │   │   └── ChatInput/
    │   ├── voice/
    │   │   └── VoiceRecorder/
    │   └── auth/
    │       └── LoginForm/
    └── components/ui/
```

### Pattern 2: Layer-First (Alternative)

```
src/
├── core/
│   ├── domain/
│   │   ├── chat/
│   │   ├── voice/
│   │   └── auth/
│   ├── use-cases/
│   │   ├── chat/
│   │   ├── voice/
│   │   └── auth/
│   └── ports/
│       ├── repositories/
│       └── services/
```

**Recommendation:** Use **Feature Modules** for better cohesion and easier navigation.

---

## Naming Conventions

### Files
- **Entities:** `Chat.ts`, `User.ts`, `Message.ts` (PascalCase, singular)
- **Use Cases:** `CreateChatUseCase.ts`, `SendMessageUseCase.ts` (verb + noun + UseCase)
- **Repositories:** `IChatRepository.ts`, `PrismaChatRepository.ts` (I prefix for interfaces)
- **Components:** `ChatList.tsx`, `MessageBubble.tsx` (PascalCase)
- **Hooks:** `useChat.ts`, `useVoiceRecording.ts` (camelCase, use prefix)
- **Utils:** `formatDate.ts`, `validateEmail.ts` (camelCase, verb)

### Folders
- **Features:** `chat`, `voice`, `auth` (lowercase, singular)
- **Components:** `ChatList`, `VoiceRecorder` (PascalCase, folder = component name)
- **Layers:** `domain`, `use-cases`, `infrastructure` (lowercase)

---

## Import Paths (using @ alias)

```typescript
// Domain
import { Chat } from '@/core/domain/entities/Chat';
import { ChatId } from '@/core/domain/value-objects/ChatId';

// Use Cases
import { CreateChatUseCase } from '@/core/use-cases/chat/CreateChatUseCase';

// Ports
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';

// Infrastructure
import { PrismaChatRepository } from '@/infrastructure/repositories/prisma/PrismaChatRepository';

// Presentation
import { ChatList } from '@/presentation/components/features/chat/ChatList';
import { Button } from '@/presentation/components/ui/button';
import { useChat } from '@/presentation/hooks/features/useChat';

// Shared
import { formatDate } from '@/shared/lib/utils/date';
import { AppError } from '@/shared/lib/errors/AppError';

// Config
import { container } from '@/config/di/container';
import { env } from '@/config/env/client';
```

---

## Common Scenarios

### Scenario 1: Adding "Message Reactions" Feature

1. **Domain Entity**
   - Location: `core/domain/entities/Reaction.ts`
   - Add `reactions: Reaction[]` to `Message` entity

2. **Use Case**
   - Location: `core/use-cases/message/AddReactionUseCase.ts`
   - Implements business rules (e.g., one reaction per user per message)

3. **Repository Method**
   - Add `addReaction()` to `IMessageRepository`
   - Implement in `PrismaMessageRepository`

4. **API Route**
   - Location: `app/api/messages/[id]/reactions/route.ts`
   - POST endpoint to add reaction

5. **Component**
   - Location: `presentation/components/features/chat/MessageReactions/`
   - UI for displaying and adding reactions

6. **Hook**
   - Location: `presentation/hooks/features/useMessageReactions.ts`
   - Wraps API calls with React Query

---

### Scenario 2: Switching from OpenAI to Anthropic

**Only change:** `config/di/bindings.ts`

```typescript
// Before
container.bind<IAIProvider>(TYPES.IAIProvider).to(OpenAIProvider);

// After
container.bind<IAIProvider>(TYPES.IAIProvider).to(AnthropicProvider);
```

**Everything else stays the same!** That's the power of dependency inversion.

---

## Best Practices

### ✅ DO
- Keep entities pure (no external dependencies)
- Put business logic in use-cases
- Use dependency injection
- Test use-cases in isolation
- Keep components thin (delegate to hooks)
- Use mappers to convert between layers

### ❌ DON'T
- Import infrastructure in domain layer
- Put business logic in components
- Call repositories directly from components
- Bypass use-cases (always go through them)
- Mix UI and business logic
- Use domain entities in API responses (use DTOs)

---

## Quick Start Commands

```bash
# Create new feature module
mkdir -p src/core/{feature-name}/{domain,use-cases,ports}
mkdir -p src/infrastructure/{feature-name}
mkdir -p src/presentation/components/features/{feature-name}

# Example: Create "notification" feature
mkdir -p src/core/notification/{domain,use-cases,ports}
mkdir -p src/infrastructure/notification
mkdir -p src/presentation/components/features/notification
```

---

## Summary

**Remember:**
- **Domain** = Business rules and entities
- **Use Cases** = Application workflows
- **Infrastructure** = External integrations (DB, APIs)
- **Presentation** = UI and user interactions
- **Shared** = Cross-cutting concerns (utils, errors)

When in doubt, ask yourself: **"If I swap OpenAI for Anthropic, or React for Vue, will this code break?"**
- If yes → Move to infrastructure or presentation
- If no → Keep in domain or use-cases

