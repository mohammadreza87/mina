# 🚀 Mina - Quick Reference Guide

## 📄 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **README.md** | Project overview, setup, basic usage | Start here |
| **APPLE_LIQUID_GLASS_DESIGN.md** | Complete design system specification | When designing new UI |
| **GLASS_IMPLEMENTATION_GUIDE.md** | Usage patterns, best practices | When implementing pages |
| **ARCHITECTURE.md** | Architecture overview and principles | Understanding code structure |
| **PROJECT_STRUCTURE.md** | Complete folder/file organization | Finding where code lives |
| **IMPLEMENTATION_COMPLETE.md** | Architecture implementation status | Checking what's done |

---

## 🎨 Glass Components Cheat Sheet

### Import Statement
```tsx
import {
  GlassButton,
  GlassPanel,
  GlassCard,
  GlassInput,
  GlassTextArea,
  GlassBadge,
  GlassNotification,
  GlassModal,
  GlassNavBar,
  GlassSection,
  GlassHero,
  GlassGrid,
} from '@/components/glass/GlassComponents';
```

### GlassButton
```tsx
// Variants: filled, glass, minimal
// Colors: blue, purple, pink, teal

<GlassButton variant="filled" color="blue" onClick={handleClick}>
  Primary Action
</GlassButton>

<GlassButton variant="glass">
  Secondary Action
</GlassButton>

<GlassButton variant="minimal" color="blue">
  Tertiary Link
</GlassButton>
```

### GlassPanel / GlassCard
```tsx
// Levels: 1 (ultra-thin), 2 (thin), 3 (regular), 4 (thick)
// hover: boolean (default true for GlassCard)

<GlassPanel level={2} className="p-6">
  Content here
</GlassPanel>

<GlassCard>  {/* Same as GlassPanel with hover effect */}
  Card content
</GlassCard>
```

### GlassInput / GlassTextArea
```tsx
<GlassInput
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

<GlassTextArea
  placeholder="Your message"
  rows={4}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

### GlassBadge
```tsx
// Colors: blue, purple, pink, teal, green, orange

<GlassBadge color="blue">New</GlassBadge>
<GlassBadge color="green">Success</GlassBadge>
```

### GlassNotification
```tsx
// Types: success, error, warning, info

<GlassNotification type="success" onClose={handleClose}>
  Operation completed successfully!
</GlassNotification>
```

### GlassModal
```tsx
// Sizes: sm, md, lg

const [isOpen, setOpen] = useState(false);

<GlassModal
  isOpen={isOpen}
  onClose={() => setOpen(false)}
  title="Modal Title"
  size="md"
>
  Modal content here
</GlassModal>
```

### GlassNavBar
```tsx
<GlassNavBar>
  <div className="flex items-center justify-between">
    <h1>App Name</h1>
    <nav>Navigation links</nav>
  </div>
</GlassNavBar>
```

### GlassHero
```tsx
<GlassHero
  title={<>Main Title</>}
  subtitle="Subtitle text"
  cta={<GlassButton>Get Started</GlassButton>}
  background={<div>Background gradient orbs</div>}
/>
```

### GlassSection
```tsx
<GlassSection className="bg-bg-secondary/30">
  <h2>Section Title</h2>
  <p>Section content</p>
</GlassSection>
```

### GlassGrid
```tsx
// Cols: 2, 3, 4

<GlassGrid cols={3}>
  <GlassCard>Item 1</GlassCard>
  <GlassCard>Item 2</GlassCard>
  <GlassCard>Item 3</GlassCard>
</GlassGrid>
```

---

## 🎨 Tailwind Utilities Cheat Sheet

### Backgrounds
```tsx
className="bg-bg-primary"      // #0a0e1a - Deep navy
className="bg-bg-secondary"    // #12151f - Slightly lighter
className="bg-bg-tertiary"     // #1a1d29 - Modals, cards
```

### Glass Materials
```tsx
className="bg-glass-ultra-thin"  // rgba(255,255,255,0.05)
className="bg-glass-thin"        // rgba(255,255,255,0.08)
className="bg-glass-regular"     // rgba(255,255,255,0.12)
className="bg-glass-thick"       // rgba(255,255,255,0.18)
```

### Backdrop Filters
```tsx
className="backdrop-blur-sm"     // 8px blur
className="backdrop-blur-md"     // 40px blur
className="backdrop-blur-lg"     // 60px blur
className="backdrop-saturate-180" // 1.8x saturation
```

### Accent Colors
```tsx
className="text-accent-blue"     // #007AFF - iOS blue
className="text-accent-purple"   // #AF52DE
className="text-accent-pink"     // #FF375F
className="text-accent-teal"     // #30D5C8
className="text-accent-green"    // #34C759
className="text-accent-orange"   // #FF9500
```

### Text Colors
```tsx
className="text-white/95"  // Primary text
className="text-white/70"  // Secondary text
className="text-white/50"  // Tertiary text
```

### Gradients
```tsx
className="bg-gradient-to-r from-accent-blue to-accent-purple"
className="bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary"
className="bg-clip-text text-transparent"  // For gradient text
```

### Shadows
```tsx
className="shadow-sm"           // 0 2px 8px
className="shadow-md"           // 0 8px 32px
className="shadow-lg"           // 0 16px 64px
className="shadow-accent-blue"  // Colored shadow
```

### Border Radius
```tsx
className="rounded-lg"   // 12px - Buttons, inputs
className="rounded-xl"   // 16px - Cards
className="rounded-2xl"  // 20px - Modals
className="rounded-full" // Pills, badges
```

### Transitions
```tsx
className="transition-all duration-200 ease-apple"
className="hover:shadow-lg hover:-translate-y-1"
className="active:scale-95"
```

### Animations
```tsx
className="animate-fade-scale"     // Entrance
className="animate-slide-up"       // Slide up
className="animate-slide-down"     // Slide down
className="animate-fade-in"        // Fade in
className="animate-float-gentle"   // Gentle float
```

---

## 🏗️ Architecture Patterns

### Using Chats Hook
```tsx
import { useChats } from '@/presentation/hooks/features/useChats';

const { chats, createChat, updateChat, deleteChat, isLoading } = useChats();

// Create
await createChat({ title: 'New Chat', userId: 'user-id' });

// Update
await updateChat({ chatId: 'chat-id', title: 'Updated Title' });

// Delete
await deleteChat('chat-id');
```

### Using Single Chat Hook
```tsx
import { useChat } from '@/presentation/hooks/features/useChats';

const { chat, sendMessage, isLoading } = useChat('chat-id');

// Send message
await sendMessage({
  chatId: 'chat-id',
  content: 'Hello!',
  role: 'user',
  type: 'text',
});
```

### Creating a Use Case
```typescript
// 1. Define in src/core/use-cases/
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/di/types';

@injectable()
export class MyUseCase {
  constructor(
    @inject(TYPES.IChatRepository) private repo: IChatRepository
  ) {}

  async execute(input: MyInput): Promise<MyOutput> {
    // Validation
    const result = mySchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Invalid input', result.error.errors);
    }

    // Business logic
    const data = await this.repo.someMethod();

    return data;
  }
}

// 2. Register in src/config/di/container.ts
container.bind<MyUseCase>(TYPES.MyUseCase).to(MyUseCase);

// 3. Use in API route
const useCase = container.get<MyUseCase>(TYPES.MyUseCase);
const result = await useCase.execute(input);
```

### Creating an API Route
```typescript
// src/app/api/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/config/di/container';
import { TYPES } from '@/config/di/types';
import { MyUseCase } from '@/core/use-cases/MyUseCase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useCase = container.get<MyUseCase>(TYPES.MyUseCase);
    const result = await useCase.execute(body);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 📁 File Organization

### Where to Put New Files

| Type | Location | Example |
|------|----------|---------|
| Domain Entity | `src/core/domain/entities/` | `Chat.ts`, `Message.ts` |
| Value Object | `src/core/domain/value-objects/` | `ChatId.ts`, `MessageId.ts` |
| Use Case | `src/core/use-cases/[feature]/` | `CreateChatUseCase.ts` |
| Repository Interface | `src/core/ports/repositories/` | `IChatRepository.ts` |
| Repository Implementation | `src/infrastructure/repositories/` | `InMemoryChatRepository.ts` |
| React Hook | `src/presentation/hooks/features/` | `useChats.ts` |
| Glass Component | `src/components/glass/` | Add to `GlassComponents.tsx` |
| Page Component | `src/app/[route]/` | `page.tsx` |
| API Route | `src/app/api/[route]/` | `route.ts` |
| GSAP Animation | `src/animations/` | `designSystem.ts` |

---

## 🎯 Common Tasks

### Creating a New Page with Glass Design
```tsx
// src/app/my-page/page.tsx
'use client';

import {
  GlassSection,
  GlassPanel,
  GlassButton,
} from '@/components/glass/GlassComponents';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
      <GlassSection>
        <GlassPanel level={2}>
          <h1 className="text-3xl font-semibold text-white/95 mb-4">
            My Page Title
          </h1>
          <p className="text-[15px] text-white/70 mb-6">
            Page description goes here.
          </p>
          <GlassButton variant="filled" color="blue">
            Call to Action
          </GlassButton>
        </GlassPanel>
      </GlassSection>
    </div>
  );
}
```

### Adding a New Color to the Palette
```typescript
// 1. Update tailwind.config.ts
colors: {
  accent: {
    // ... existing
    indigo: '#5856D6',
  }
}

// 2. Update GlassComponents.tsx color maps
const colors = {
  // ... existing
  indigo: 'bg-gradient-to-b from-[#5856D6] to-[#4745B8]',
};
```

### Creating a Form with Validation
```tsx
'use client';

import { useState } from 'react';
import { GlassPanel, GlassInput, GlassButton, GlassNotification } from '@/components/glass/GlassComponents';

export function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    // Submit logic
    setSuccess(true);
  };

  return (
    <GlassPanel level={2} className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-white/95 mb-6">Sign Up</h2>

      <div className="space-y-4">
        <GlassInput
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <GlassNotification type="error" onClose={() => setError('')}>
            {error}
          </GlassNotification>
        )}

        {success && (
          <GlassNotification type="success">
            Success! Check your email.
          </GlassNotification>
        )}

        <GlassButton variant="filled" color="blue" onClick={handleSubmit}>
          Submit
        </GlassButton>
      </div>
    </GlassPanel>
  );
}
```

---

## 🔗 Quick Links

### Demo Pages
- [Glass Components Demo](http://localhost:3000/glass-demo) - All components showcase
- [Landing Page Example](http://localhost:3000/landing) - Real-world example
- [Design Demo (Bold Retro)](http://localhost:3000/design-demo) - Previous design system

### API Endpoints
- `GET /api/chats` - List all chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/[id]` - Get single chat
- `PATCH /api/chats/[id]` - Update chat
- `DELETE /api/chats/[id]` - Delete chat
- `POST /api/chats/[id]/messages` - Send message to chat

---

## 💡 Tips & Best Practices

### Design
- ✅ Use `bg-bg-primary` not `bg-black`
- ✅ Always include `backdrop-blur-*` with glass materials
- ✅ Keep borders subtle: `border-white/10` to `border-white/20`
- ✅ Use generous padding: minimum `p-4`, prefer `p-6` or `p-8`
- ✅ Transition duration: 200-300ms with `ease-apple`

### Code
- ✅ Use DI container for all use cases
- ✅ Validate inputs with Zod in use cases
- ✅ Use TanStack Query for API calls
- ✅ Keep components client-side when using state/effects
- ✅ Follow folder structure conventions

### Performance
- ✅ Limit glass panels per page (5-7 max)
- ✅ Use lower blur values when possible
- ✅ Don't nest more than 3 glass layers
- ✅ Optimize images and assets
- ✅ Use `will-change-transform` for animations

---

## 🐛 Common Issues & Solutions

### Glass effect not visible
**Problem**: Panels look solid
**Solution**: Use gradient backgrounds, not pure black

### Tailwind classes not applying
**Problem**: Custom utilities not working
**Solution**: `rm -rf .next && npm run dev`

### Build errors with DI container
**Problem**: Next.js + inversify compatibility
**Solution**: Clear `.next`, ensure proper imports

### Text hard to read
**Problem**: Low contrast
**Solution**: Use higher glass levels (3-4) and `text-white/95`

---

## 📞 Getting Help

1. Check relevant documentation (see index above)
2. Review demo pages for examples
3. Look at existing implementations in the codebase
4. Consult this quick reference

---

**Last Updated**: November 2025
**Version**: 1.0.0
