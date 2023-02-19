import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    UserModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'notedb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    NoteModule,
  ],
})
export class AppModule {}
