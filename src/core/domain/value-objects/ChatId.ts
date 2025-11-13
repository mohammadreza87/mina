import { v4 as uuidv4 } from 'uuid';

/**
 * Value Object representing a Chat identifier
 * Ensures all Chat IDs are valid and provides type safety
 */
export class ChatId {
  private constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('ChatId cannot be empty');
    }
  }

  /**
   * Generates a new unique ChatId
   */
  static generate(): ChatId {
    return new ChatId(uuidv4());
  }

  /**
   * Creates a ChatId from an existing string value
   * Useful when loading from database
   */
  static fromString(value: string): ChatId {
    return new ChatId(value);
  }

  /**
   * Compares two ChatIds for equality
   */
  equals(other: ChatId): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the string representation of the ChatId
   */
  toString(): string {
    return this.value;
  }
}
