import { AppError } from './AppError';

/**
 * Thrown when input validation fails
 */
export class ValidationError extends AppError {
  public readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400);
    this.details = details;
  }
}
