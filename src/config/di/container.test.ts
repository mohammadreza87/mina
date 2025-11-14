import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Import interfaces
import { IChatRepository } from '@/core/ports/repositories/IChatRepository';

// Import use cases
import { CreateChatUseCase } from '@/core/use-cases/chat/CreateChatUseCase';
import { GetUserChatsUseCase } from '@/core/use-cases/chat/GetUserChatsUseCase';
import { GetChatByIdUseCase } from '@/core/use-cases/chat/GetChatByIdUseCase';
import { SendMessageUseCase } from '@/core/use-cases/chat/SendMessageUseCase';
import { UpdateChatSettingsUseCase } from '@/core/use-cases/chat/UpdateChatSettingsUseCase';
import { DeleteChatUseCase } from '@/core/use-cases/chat/DeleteChatUseCase';

// Import test implementations
import { InMemoryChatRepository } from '@/infrastructure/repositories/in-memory/InMemoryChatRepository';

/**
 * Creates a test container with in-memory implementations
 * Use this in your unit and integration tests
 *
 * @example
 * ```typescript
 * import { createTestContainer } from '@/config/di/container.test';
 *
 * describe('CreateChatUseCase', () => {
 *   let container: Container;
 *   let useCase: CreateChatUseCase;
 *
 *   beforeEach(() => {
 *     container = createTestContainer();
 *     useCase = container.get(TYPES.CreateChatUseCase);
 *   });
 *
 *   afterEach(() => {
 *     container.unbindAll();
 *   });
 *
 *   it('should create a chat', async () => {
 *     // Test implementation
 *   });
 * });
 * ```
 */
export function createTestContainer(): Container {
  const container = new Container();

  // ===== REPOSITORIES =====
  // Always use in-memory implementations for tests (fast, isolated, no side effects)
  container
    .bind<IChatRepository>(TYPES.IChatRepository)
    .to(InMemoryChatRepository)
    .inSingletonScope();

  // ===== USE CASES =====
  container.bind<CreateChatUseCase>(TYPES.CreateChatUseCase).to(CreateChatUseCase).inSingletonScope();
  container.bind<GetUserChatsUseCase>(TYPES.GetUserChatsUseCase).to(GetUserChatsUseCase).inSingletonScope();
  container.bind<GetChatByIdUseCase>(TYPES.GetChatByIdUseCase).to(GetChatByIdUseCase).inSingletonScope();
  container.bind<SendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase).inSingletonScope();
  container.bind<UpdateChatSettingsUseCase>(TYPES.UpdateChatSettingsUseCase).to(UpdateChatSettingsUseCase).inSingletonScope();
  container.bind<DeleteChatUseCase>(TYPES.DeleteChatUseCase).to(DeleteChatUseCase).inSingletonScope();

  return container;
}

/**
 * Creates a test container and binds it to the global container
 * Useful for integration tests that need to replace the production container
 *
 * WARNING: Use with caution - this modifies global state
 */
export function setupTestContainer(): Container {
  const testContainer = createTestContainer();

  // You can optionally snapshot and restore the production container
  return testContainer;
}
