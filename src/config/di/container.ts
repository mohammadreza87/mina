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
const useInMemoryRepository = process.env.USE_IN_MEMORY_CHAT_REPO === 'true';
const repositoryImplementation = useInMemoryRepository
  ? InMemoryChatRepository
  : FileSystemChatRepository;

container
  .bind<IChatRepository>(TYPES.IChatRepository)
  .to(repositoryImplementation)
  .inSingletonScope();

// ===== USE CASES =====
container.bind<CreateChatUseCase>(TYPES.CreateChatUseCase).to(CreateChatUseCase);
container.bind<GetUserChatsUseCase>(TYPES.GetUserChatsUseCase).to(GetUserChatsUseCase);
container.bind<GetChatByIdUseCase>(TYPES.GetChatByIdUseCase).to(GetChatByIdUseCase);
container.bind<SendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase);
container.bind<UpdateChatSettingsUseCase>(TYPES.UpdateChatSettingsUseCase).to(UpdateChatSettingsUseCase);
container.bind<DeleteChatUseCase>(TYPES.DeleteChatUseCase).to(DeleteChatUseCase);

export { container };
