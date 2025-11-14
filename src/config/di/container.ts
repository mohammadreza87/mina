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

// Import implementations
import { InMemoryChatRepository } from '@/infrastructure/repositories/in-memory/InMemoryChatRepository';
import { FileSystemChatRepository } from '@/infrastructure/repositories/file-system/FileSystemChatRepository';

/**
 * Dependency Injection Container
 * Configure all bindings here
 */
const container = new Container();

// ===== REPOSITORIES =====
// Using factory pattern for conditional binding based on environment
container
  .bind<IChatRepository>(TYPES.IChatRepository)
  .toDynamicValue(() => {
    const useInMemory = process.env.USE_IN_MEMORY_CHAT_REPO === 'true';
    return useInMemory
      ? new InMemoryChatRepository()
      : new FileSystemChatRepository();
  })
  .inSingletonScope();

// ===== USE CASES =====
// Use cases are stateless and safe to share - using singleton scope for performance
// Using manual binding (no decorators) for Turbopack compatibility
container
  .bind<CreateChatUseCase>(TYPES.CreateChatUseCase)
  .toDynamicValue(() => {
    const repo = container.get<IChatRepository>(TYPES.IChatRepository);
    return new CreateChatUseCase(repo);
  })
  .inSingletonScope();

container
  .bind<GetUserChatsUseCase>(TYPES.GetUserChatsUseCase)
  .toDynamicValue(() => {
    const repo = container.get<IChatRepository>(TYPES.IChatRepository);
    return new GetUserChatsUseCase(repo);
  })
  .inSingletonScope();

container
  .bind<GetChatByIdUseCase>(TYPES.GetChatByIdUseCase)
  .toDynamicValue(() => {
    const repo = container.get<IChatRepository>(TYPES.IChatRepository);
    return new GetChatByIdUseCase(repo);
  })
  .inSingletonScope();

container
  .bind<SendMessageUseCase>(TYPES.SendMessageUseCase)
  .toDynamicValue(() => {
    const repo = container.get<IChatRepository>(TYPES.IChatRepository);
    return new SendMessageUseCase(repo);
  })
  .inSingletonScope();

container
  .bind<UpdateChatSettingsUseCase>(TYPES.UpdateChatSettingsUseCase)
  .toDynamicValue(() => {
    const repo = container.get<IChatRepository>(TYPES.IChatRepository);
    return new UpdateChatSettingsUseCase(repo);
  })
  .inSingletonScope();

container
  .bind<DeleteChatUseCase>(TYPES.DeleteChatUseCase)
  .toDynamicValue(() => {
    const repo = container.get<IChatRepository>(TYPES.IChatRepository);
    return new DeleteChatUseCase(repo);
  })
  .inSingletonScope();

export { container };
