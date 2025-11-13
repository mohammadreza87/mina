# Mina – AI Voice Assistant

Premium Next.js 16 voice assistant that combines Apple Liquid Glass aesthetics, GSAP motion, and a hexagonal architecture powered by dependency injection.

## Highlights

- 🍎 **Voice-first Apple UI** – Glass panels, kinetic typography, and GSAP-powered micro-interactions.
- 🎙️ **Dual chat surfaces** – Text chat with transcription + simulated voice calls via `CallExperience` and `MicButton`.
- 🧱 **Hexagonal architecture** – Domain entities (`Chat`, `Message`) + value objects + use cases orchestrated via Inversify.
- 🔌 **TanStack Query data layer** – `useChats` hook keeps the UI in sync with `/api/chats` REST endpoints.
- 🔐 **NextAuth + Prisma auth** – Credentials + Google OAuth backed by a Prisma adapter (SQLite for MVP, swap to Postgres when you scale).
- 🎛️ **Extensive design docs** – Multiple guides in the repo walk through structure, refactors, and the design language.

## Routes & Screens

| Route          | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | Architecture demo showing chat creation and listing backed by the new `useChats` hook.                                                     |
| `/auth`        | Unified sign-in/sign-up page with Apple Liquid Glass design, validation, OAuth buttons (Apple, Google), and email/password authentication. |
| `/landing`     | Marketing landing page assembled from the Apple Liquid Glass component library.                                                            |
| `/glass-demo`  | Full showcase of every glass component/animation.                                                                                          |
| `/design-demo` | Alternate Bold Retro design system playground (`src/components/design-system`).                                                            |
| `/api/chats`   | REST endpoints for CRUD + messaging (see "API Surface").                                                                                   |

## Voice & Chat Flow

1. **UI:** Surfaces such as `ChatWorkspace`, `ChatMessages`, and `CallExperience` consume data from `useChats` (TanStack Query).
2. **React Query ↔ API:** `useChats` calls `/api/chats` (list/create) or `/api/chats/[id]` (read/update/delete/messages) and caches responses.
3. **API Layer:** Each route resolves a use case from the Inversify container (`src/config/di/container.ts`) and never touches persistence directly.
4. **Use Cases:** `CreateChatUseCase`, `SendMessageUseCase`, etc. orchestrate domain logic, enforce zod validation, and talk to the repository ports.
5. **Domain:** `Chat` aggregates own `Message`s, keeps timestamps up to date, and applies invariants (e.g., message ownership, title validation).
6. **Infrastructure:** `FileSystemChatRepository` persists chats to `.data/chats.json` (swap to Prisma/Mongo later, or set `USE_IN_MEMORY_CHAT_REPO=true` for the previous adapter).
7. **Voice Pipeline:** `useVoiceRecording` wraps `MediaRecorder`, streams blobs to OpenAI Whisper via `speechToText`, and replays audio via `MicButton`.

## Architecture Layers

- **Domain (`src/core/domain`)** – Entities, value objects, and business invariants that are UI/framework agnostic.
- **Application (`src/core/use-cases`)** – zod-validated use cases that coordinate domain logic and repositories.
- **Ports (`src/core/ports`)** – Contracts the infrastructure must satisfy. Only `IChatRepository` is implemented today.
- **Infrastructure (`src/infrastructure/repositories`)** – Swappable adapters; currently in-memory storage for rapid iteration.
- **Presentation (`src/app`, `src/components`, `src/presentation/hooks`)** – Next.js pages, React components, hooks, contexts, and animation helpers.
- **Config (`src/config/di`)** – Inversify container + symbol registry used by API routes and server components.

## Key Modules

- **Auth shell** – `AuthProvider` wraps NextAuth’s `SessionProvider`, `signIn`, and `signOut`; `ProtectedRoute` shows a GSAP loading screen until the session resolves, while `AuthLayoutWrapper` skips protection on `/auth`, `/landing`, `/glass-demo`, and `/design-demo`.
- **Data layer** – `useChats` + `useChat` expose chat CRUD/messaging mutations with optimistic updates and automatic cache invalidation.
- **Voice & media** – `useVoiceRecording` coordinates recording state, transcription, cancellation, and cleanup; `lib/openai.ts` centralizes Whisper/TTS/chat completion helpers (proxied via `/api/voice/*` using `OPENAI_API_KEY`).
- **Animations** – `lib/gsapClient` safely scopes GSAP contexts; `animations/designSystem.ts` & `heroSequence.ts` host shared timelines for hero sections, card reveals, hover lifts, etc.
- **Design systems** – Apple Liquid Glass lives in `src/components/glass/GlassComponents.tsx` while the Bold Retro playground uses `src/components/design-system/ComponentLibrary.tsx`.
- **Assistant catalog** – `assistants.json` feeds the UI (`AssistantCarousel`, `VoiceBrowser`, `CallExperience`) with metadata such as accent colors, voice tags, and moods.

## API Surface & Data Contracts

| Endpoint                   | Method   | Use Case                    | Notes                                                                          |
| -------------------------- | -------- | --------------------------- | ------------------------------------------------------------------------------ |
| `/api/chats`               | `GET`    | `GetUserChatsUseCase`       | Returns DTOs with counts + last message summary.                               |
| `/api/chats`               | `POST`   | `CreateChatUseCase`         | Validates via zod, enforces max chats per user, returns DTO.                   |
| `/api/chats/[id]`          | `GET`    | `GetChatByIdUseCase`        | Expands messages and value objects into serializable data.                     |
| `/api/chats/[id]`          | `PATCH`  | `UpdateChatSettingsUseCase` | Updates title/voice/topic/instructions with validation.                        |
| `/api/chats/[id]`          | `DELETE` | `DeleteChatUseCase`         | Ensures chat exists + belongs to the authenticated user.                       |
| `/api/chats/[id]/messages` | `POST`   | `SendMessageUseCase`        | Accepts text or voice payloads, appends to chat, returns the last message DTO. |

Errors automatically normalize via `AppError`, `ValidationError`, and `NotFoundError`, so consumers always receive `{ error, code }` payloads with appropriate status codes.

## Authentication & Database

- **NextAuth Providers** – Credentials (email/password via Prisma) and Google OAuth are enabled out of the box. The login screen (`/auth`) hits `/api/register` for sign-up, then calls `signIn('credentials')`. Google uses the standard OAuth redirect.
- **Prisma Adapter** – User, Account, Session, and VerificationToken models live in `prisma/schema.prisma`.
- **Best DB for MVP** – SQLite (`file:./prisma/dev.db`) keeps everything in a single file for rapid iteration. When you’re ready for production, switch `DATABASE_URL` to Postgres/PlanetScale and run `npm run prisma:migrate`.

## Environment & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables** (copy `.env.example` → `.env`)
   ```bash
   # minimum viable setup
   DATABASE_URL="file:./prisma/dev.db"
   AUTH_SECRET=generate-a-long-random-string
   GOOGLE_CLIENT_ID=your-google-client-id        # optional but needed for OAuth
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   OPENAI_API_KEY=sk-your-openai-api-key-here
   USE_IN_MEMORY_CHAT_REPO=false                 # flip to true for stateless demos
   ```
3. **Create the SQLite database & Prisma client**
   ```bash
   npm run prisma:migrate   # creates prisma/migrations + prisma/dev.db
   npm run prisma:generate  # optional, runs automatically during migrate/dev
   ```
4. **Create your first user**
   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Demo User","email":"demo@mina.ai","password":"super-secret"}'
   ```
   (Or just use the “Sign up” mode on `/auth`, which calls the same endpoint.)
5. **Start the dev server**
   ```bash
   npm run dev
   ```
6. Visit `/auth` to sign in. Most other routes are protected and will redirect back to `/auth` until you have an active NextAuth session.

- `npm run dev` – start Next.js 16 dev server (React Compiler + Turbopack).
- `npm run build` – production build.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint (flat config) with `eslint-config-next` + `eslint-config-prettier`.
- `npm run format` – format via Prettier.
- `npm run prisma:migrate` – create/apply Prisma migrations.
- `npm run prisma:generate` – regenerate Prisma Client.
- `npm run prisma:studio` – open Prisma Studio to inspect the DB.

## 🎨 Apple Liquid Glass Design System

The Liquid Glass library lives in `src/components/glass/GlassComponents.tsx` and powers `/auth`, `/landing`, and `/glass-demo`.

### Quick Start

```tsx
import { GlassButton, GlassPanel, GlassInput } from "@/components/glass/GlassComponents";

export function ContactForm() {
  return (
    <GlassPanel level={2} className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white/95 mb-6">Welcome</h2>
      <GlassInput placeholder="Enter your name" />
      <GlassButton variant="filled" color="blue">
        Get Started
      </GlassButton>
    </GlassPanel>
  );
}
```

### Documentation

- **[APPLE_LIQUID_GLASS_DESIGN.md](./APPLE_LIQUID_GLASS_DESIGN.md)** – Visual language spec.
- **[GLASS_IMPLEMENTATION_GUIDE.md](./GLASS_IMPLEMENTATION_GUIDE.md)** – Component usage & motion rules.
- **[/glass-demo](http://localhost:3000/glass-demo)** – Interactive component explorer.

### Key Components

- `GlassButton`, `GlassPanel`, `GlassCard`, `GlassInput`, `GlassTextArea`, `GlassBadge`, `GlassModal`, `GlassNavBar`, `GlassHero`, `GlassSection`, `GlassGrid`.
- Each component supports multiple variants, colors, backdrop blur levels, and Apple easing curves baked into Tailwind utilities.

## 🪩 Bold Retro Design System

The alternate design language showcased on `/design-demo` uses `src/components/design-system/ComponentLibrary.tsx` plus GSAP helpers in `src/animations/designSystem.ts`. It demonstrates how the underlying architecture can host multiple visual identities without touching the domain layers.

## Usage Examples

```tsx
"use client";
import { useChats } from "@/presentation/hooks/features/useChats";

export function ChatList() {
  const { chats, createChat, isLoading } = useChats();

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <button
        onClick={() =>
          createChat({
            assistantId: "mina-creative",
            title: "New Chat",
            voiceStyle: "Warm & Friendly",
            topic: "General",
            instructions: "Keep replies short",
          })
        }
      >
        Create Chat
      </button>
      {chats.map((chat) => (
        <article key={chat.id}>{chat.title}</article>
      ))}
    </div>
  );
}
```

## Design Principles

1. **Depth & Layering** – Panels float with parallax shadows and blurred backgrounds.
2. **Adaptive Materials** – Glass responds to background gradients, dark/light contexts, and hover states.
3. **Refined Minimalism** – Careful Apple-esque spacing (8 pt grid) and SF-inspired type ramps.
4. **Smooth Interactions** – GSAP timelines default to 200–300 ms with Apple easing (`cubic-bezier(0.4,0,0.2,1)`).
5. **Accessible Motion** – `usePrefersReducedMotion` disables heavy timelines when requested.

## Customization Cheatsheet

### Extend the Apple palette

```ts
// tailwind.config.ts
extend: {
  colors: {
    accent: {
      indigo: '#5856D6',
    },
  },
}
```

### Wire a new use case

```ts
@injectable()
export class MyNewUseCase {
  constructor(@inject(TYPES.IChatRepository) private repo: IChatRepository) {}
  async execute(input: MyInput) {
    // Business logic
  }
}

container.bind<MyNewUseCase>(TYPES.MyNewUseCase).to(MyNewUseCase);
const useCase = container.get<MyNewUseCase>(TYPES.MyNewUseCase);
```

## Documentation Map

- `ARCHITECTURE.md` – Deep dive into the layered/hexagonal diagram.
- `PROJECT_STRUCTURE.md` – Directory-by-directory explanation.
- `IMPLEMENTATION_COMPLETE.md` – Tracks what was built/refactored.
- `DESIGN_SYSTEM.md`, `DESIGN_IMPLEMENTATION_GUIDE.md`, `QUICK_REFERENCE.md`, `GLASS_IMPLEMENTATION_GUIDE.md` – Visual + UX guidance.
- `REFACTORING_GUIDE.md` – Notes on migrating to this architecture.
- `SETUP.md` – Environment prerequisites and optional commands.
