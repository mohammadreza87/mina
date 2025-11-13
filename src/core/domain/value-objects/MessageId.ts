import { v4 as uuidv4 } from 'uuid';

/**
 * Value Object representing a Message identifier
 */
export class MessageId {
  private constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('MessageId cannot be empty');
    }
  }

  static generate(): MessageId {
    return new MessageId(uuidv4());
  }

  static fromString(value: string): MessageId {
    return new MessageId(value);
  }

  equals(other: MessageId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
