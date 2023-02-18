import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteNotFoundException } from './exception/note-not-found.exception';
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
  async getNotes(userId: string) {
    const notes = await this.noteRepository.findBy({
      owner: {
        id: userId,
      },
    });

    return notes;
  }
}
