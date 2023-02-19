import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { UserId } from '../auth/user-id.decorator';
import { PagingOptsDto } from '../common/dto/paging-opts.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteService } from './note.service';

@Controller('note')
@ApiTags('Notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async createNote(@UserId() userId: string, @Body() noteDto: CreateNoteDto) {
    return await this.noteService.createNote(noteDto, userId);
  }

  @Get()
  @Auth()
  async getNotes(
    @UserId() userId: string,
    @Query() pagingOpts?: PagingOptsDto,
  ) {
    return await this.noteService.getNotes(
      userId,
      pagingOpts || new PagingOptsDto(),
    );
  }

  @Get(':noteId')
  @Auth()
  async getNoteById(@UserId() userId: string, @Param('noteId') noteId: string) {
    return await this.noteService.getNote(noteId, userId);
  }

  @Patch(':noteId')
  @Auth()
  async updateNote(
    @UserId() userId: string,
    @Param('noteId') noteId: string,
    @Body() noteDto: UpdateNoteDto,
  ) {
    return await this.noteService.updateNote(noteId, noteDto, userId);
  }

  @Delete(':noteId')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNote(@UserId() userId: string, @Param('noteId') noteId: string) {
    return await this.noteService.deleteNote(noteId, userId);
  }
}
