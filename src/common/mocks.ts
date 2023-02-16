import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';

export function mockRepositoryFactory<T>() {
  return mockDeep<Repository<T>>();
}
