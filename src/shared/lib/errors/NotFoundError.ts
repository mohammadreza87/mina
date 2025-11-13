import { AppError } from './AppError';

/**
 * Thrown when a requested resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
  }
}
