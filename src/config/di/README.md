# Dependency Injection Container

This directory contains the Dependency Injection (DI) configuration using InversifyJS.

## Architecture Overview

```
src/config/di/
├── container.ts           # Production container configuration
├── container.test.ts      # Test container configuration
├── container-accessor.ts  # Type-safe accessor for dependencies
├── types.ts              # Injection tokens (symbols)
└── README.md             # This file
```

## Usage

### In Production Code (API Routes, Components)

```typescript
import { ContainerAccessor } from '@/config/di/container-accessor';

// Get a use case
const useCase = ContainerAccessor.getCreateChatUseCase();
const result = await useCase.execute(data);
```

### In Tests

```typescript
import { createTestContainer } from '@/config/di/container.test';
import { TYPES } from '@/config/di/types';

describe('CreateChatUseCase', () => {
  let container: Container;
  let useCase: CreateChatUseCase;

  beforeEach(() => {
    container = createTestContainer();
    useCase = container.get(TYPES.CreateChatUseCase);
  });

  afterEach(() => {
    container.unbindAll();
  });

  it('should create a chat', async () => {
    // Test implementation
  });
});
```

## Adding New Dependencies

### 1. Add the Symbol to `types.ts`

```typescript
export const TYPES = {
  // ... existing types
  INewService: Symbol.for('INewService'),
};
```

### 2. Add Binding to `container.ts`

```typescript
import { INewService } from '@/core/ports/INewService';
import { NewServiceImpl } from '@/infrastructure/NewServiceImpl';

container
  .bind<INewService>(TYPES.INewService)
  .to(NewServiceImpl)
  .inSingletonScope(); // or .inTransientScope()
```

### 3. Add Accessor Method to `container-accessor.ts`

```typescript
static getNewService(): INewService {
  return container.get<INewService>(TYPES.INewService);
}
```

### 4. Add Test Binding to `container.test.ts`

```typescript
container
  .bind<INewService>(TYPES.INewService)
  .to(MockNewService)
  .inSingletonScope();
```

## Scoping Strategy

- **Singleton** (`.inSingletonScope()`): Single shared instance
  - Use for: Repositories, Services, Stateless use cases
  - Current: All repositories and use cases

- **Transient** (`.inTransientScope()`): New instance every time
  - Use for: Request-scoped objects, Stateful operations
  - Current: None (add as needed)

## Environment Configuration

The repository implementation is selected based on environment variables:

```bash
# Use in-memory repository (development/testing)
USE_IN_MEMORY_CHAT_REPO=true

# Use file system repository (production)
USE_IN_MEMORY_CHAT_REPO=false
```

## Migration Path

When the application grows beyond ~15 bindings, consider refactoring to module-based organization:

```typescript
// modules/repository.module.ts
export const repositoryModule = new ContainerModule((bind) => {
  bind<IChatRepository>(TYPES.IChatRepository)...
});

// container.ts
container.load(repositoryModule, useCaseModule, serviceModule);
```

## Best Practices

1. **Use ContainerAccessor** instead of direct `container.get()` calls
2. **Inject dependencies** via constructor parameters with `@inject()` decorator
3. **Use interfaces** (ports) for all injectable dependencies
4. **Keep bindings organized** by domain (repositories, use cases, services)
5. **Always use test container** in unit/integration tests
6. **Document scope choices** when deviating from singleton pattern

## Common Patterns

### Factory Pattern (Conditional Binding)

```typescript
container
  .bind<IService>(TYPES.IService)
  .toDynamicValue(() => {
    return condition
      ? new ServiceA()
      : new ServiceB();
  })
  .inSingletonScope();
```

### Constructor Injection

```typescript
import { injectable, inject } from 'inversify';

@injectable()
class MyUseCase {
  constructor(
    @inject(TYPES.IChatRepository)
    private chatRepository: IChatRepository
  ) {}
}
```

## Troubleshooting

### "No matching bindings found"
- Ensure the type is added to `types.ts`
- Verify the binding exists in `container.ts`
- Check that `reflect-metadata` is imported

### "Cannot read property of undefined"
- Ensure the constructor parameter has `@inject()` decorator
- Verify the class has `@injectable()` decorator

### Tests failing with singleton state
- Use `createTestContainer()` for isolated test containers
- Call `container.unbindAll()` in `afterEach()` hooks
