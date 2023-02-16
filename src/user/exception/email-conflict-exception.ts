import { ConflictException } from '@nestjs/common';

export class EmailConflictException extends ConflictException {
  constructor() {
    super('Email is already used by an existing account');
  }
}
