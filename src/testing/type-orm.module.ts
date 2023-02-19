import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmTestModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  autoLoadEntities: true,
});
