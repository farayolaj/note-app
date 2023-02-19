import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Note } from './note.entity';
import { NoteService } from './note.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule],
  providers: [NoteService],
})
export class NoteModule {}
