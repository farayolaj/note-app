import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
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
