/**
 * Dependency Injection type symbols
 * Use these symbols to bind and resolve dependencies
 */
export const TYPES = {
  // Repositories
  IChatRepository: Symbol.for('IChatRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  IMessageRepository: Symbol.for('IMessageRepository'),

  // Services
  IAIProvider: Symbol.for('IAIProvider'),
  IVoiceTranscriber: Symbol.for('IVoiceTranscriber'),
  IVoiceSynthesizer: Symbol.for('IVoiceSynthesizer'),

  // Use Cases
  CreateChatUseCase: Symbol.for('CreateChatUseCase'),
  GetUserChatsUseCase: Symbol.for('GetUserChatsUseCase'),
  GetChatByIdUseCase: Symbol.for('GetChatByIdUseCase'),
  SendMessageUseCase: Symbol.for('SendMessageUseCase'),
  UpdateChatSettingsUseCase: Symbol.for('UpdateChatSettingsUseCase'),
  DeleteChatUseCase: Symbol.for('DeleteChatUseCase'),
};
