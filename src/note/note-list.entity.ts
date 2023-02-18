import { Note } from './note.entity';

export class NoteList {
  notes: Note[];
  page: number;
  pageCount: number;

  constructor(notes: Note[], page: number, pageCount: number) {
    this.notes = notes;
    this.page = page;
    this.pageCount = pageCount;
  }
}
