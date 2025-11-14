import { container } from './container';
import { TYPES } from './types';
import type { IChatRepository } from '@/core/ports/repositories/IChatRepository';
import type { CreateChatUseCase } from '@/core/use-cases/chat/CreateChatUseCase';
import type { GetUserChatsUseCase } from '@/core/use-cases/chat/GetUserChatsUseCase';
import type { GetChatByIdUseCase } from '@/core/use-cases/chat/GetChatByIdUseCase';
import type { SendMessageUseCase } from '@/core/use-cases/chat/SendMessageUseCase';
import type { UpdateChatSettingsUseCase } from '@/core/use-cases/chat/UpdateChatSettingsUseCase';
import type { DeleteChatUseCase } from '@/core/use-cases/chat/DeleteChatUseCase';

/**
 * Type-safe accessor for the DI container
 * Provides a clean API for retrieving dependencies without directly accessing container.get()
 *
 * Benefits:
 * - Type safety: TypeScript will catch errors at compile time
 * - Discoverability: IDE autocomplete shows all available dependencies
 * - Maintainability: Centralized place to manage container access
 * - Testing: Easy to mock by replacing this module
 *
 * @example
 * ```typescript
 * // In API routes
 * import { ContainerAccessor } from '@/config/di/container-accessor';
 *
 * export async function POST(req: Request) {
 *   const useCase = ContainerAccessor.getCreateChatUseCase();
 *   const result = await useCase.execute(data);
 *   return NextResponse.json(result);
 * }
 * ```
 */
export class ContainerAccessor {
  // ===== REPOSITORIES =====

  static getChatRepository(): IChatRepository {
    return container.get<IChatRepository>(TYPES.IChatRepository);
  }

  // ===== USE CASES =====

  static getCreateChatUseCase(): CreateChatUseCase {
    return container.get<CreateChatUseCase>(TYPES.CreateChatUseCase);
  }

  static getGetUserChatsUseCase(): GetUserChatsUseCase {
    return container.get<GetUserChatsUseCase>(TYPES.GetUserChatsUseCase);
  }

  static getGetChatByIdUseCase(): GetChatByIdUseCase {
    return container.get<GetChatByIdUseCase>(TYPES.GetChatByIdUseCase);
  }

  static getSendMessageUseCase(): SendMessageUseCase {
    return container.get<SendMessageUseCase>(TYPES.SendMessageUseCase);
  }

  static getUpdateChatSettingsUseCase(): UpdateChatSettingsUseCase {
    return container.get<UpdateChatSettingsUseCase>(TYPES.UpdateChatSettingsUseCase);
  }

  static getDeleteChatUseCase(): DeleteChatUseCase {
    return container.get<DeleteChatUseCase>(TYPES.DeleteChatUseCase);
  }
}
