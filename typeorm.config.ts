import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Note } from './src/note/note.entity';
import { User } from './src/user/user.entity';
import { InitialMigration1676837226121 } from './migrations/1676837226121-InitialMigration';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  entities: [Note, User],
  url: configService.get<string>('DATABASE_URL'),
  migrations: [InitialMigration1676837226121],
});
