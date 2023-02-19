import { Note } from './note.entity';

export class NoteList {
  data: Note[];
  page: number;
  pageCount: number;

  constructor(data: Note[], page: number, pageCount: number) {
    this.data = data;
    this.page = page;
    this.pageCount = pageCount;
  }
}
