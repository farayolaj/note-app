import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingOptsDto } from '../common/dto/paging-opts.dto';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteNotFoundException } from './exception/note-not-found.exception';
import { NoteList } from './note-list.entity';
import { Note } from './note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    private userService: UserService,
  ) {}

  /**
   * Create a new note.
   */
  async createNote(noteDto: CreateNoteDto, userId: string) {
    const user = await this.userService.getUserById(userId);
    const note = new Note();
    note.title = noteDto.title;
    note.content = noteDto.content;
    note.owner = user;
    return await this.noteRepository.save(note);
  }

  /**
   * Update an existing note.
   * @throws NoteNotFoundException
   */
  async updateNote(noteId: string, noteDto: UpdateNoteDto, userId: string) {
    let note = await this.noteRepository.findOneBy({
      id: noteId,
      owner: {
        id: userId,
      },
    });

    if (note == null) throw new NoteNotFoundException();

    note = this.noteRepository.merge(note, noteDto);
    await this.noteRepository.save(note);

    return note;
  }

  /**
   * Delete an existing note.
   * @throws NoteNotFoundException
   */
  async deleteNote(noteId: string, userId: string) {
    const note = await this.noteRepository.findOneBy({
      id: noteId,
      owner: {
        id: userId,
      },
    });

    if (note == null) throw new NoteNotFoundException();

    await this.noteRepository.remove(note);
  }

  /**
   * Get a note by its id.
   * @throws NoteNotFoundException
   */
  async getNote(noteId: string, userId: string) {
    const note = await this.noteRepository.findOneBy({
      id: noteId,
      owner: {
        id: userId,
      },
    });

    if (note == null) throw new NoteNotFoundException();

    return note;
  }

  /**
   * Get all notes that belong to a user.
   */
  async getNotes(userId: string, paging: PagingOptsDto) {
    const notes = await this.noteRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      take: paging.pageSize,
      skip: (paging.page - 1) * paging.pageSize,
      order: {
        lastEdited: 'desc',
      },
    });
    const totalNoteCount = await this.noteRepository.countBy({
      owner: { id: userId },
    });

    return new NoteList(
      notes,
      paging.page,
      Math.max(Math.ceil(totalNoteCount / paging.pageSize), 1),
    );
  }
}
