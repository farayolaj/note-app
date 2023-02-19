import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TypeOrmTestModule } from '../testing/type-orm.module';
import { User } from '../user/user.entity';
import { Note } from './note.entity';
import { NoteService } from './note.service';
import { generateNoteDto, generateUserDto } from '../common/testing/generators';
import { UserService } from '../user/user.service';
import { NoteNotFoundException } from './exception/note-not-found.exception';

describe('NoteService', () => {
  let service: NoteService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmTestModule,
        TypeOrmModule.forFeature([User, Note]),
        UserModule,
      ],
      providers: [NoteService],
    }).compile();

    service = module.get<NoteService>(NoteService);
    userService = module.get<UserService>(UserService);
  });

  describe('createNote', () => {
    it('should create a note', async () => {
      const user = await userService.createUser(generateUserDto());
      const noteDto = generateNoteDto();
      const note = await service.createNote(noteDto, user.id);
      expect(note).toHaveProperty('id');
      expect(note).toMatchObject({
        title: noteDto.title,
        content: noteDto.content,
        owner: user,
      });
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const user = await userService.createUser(generateUserDto());
      const noteDto = generateNoteDto();
      const note = await service.createNote(noteDto, user.id);
      const updatedNoteDto = generateNoteDto();
      const updatedNote = await service.updateNote(
        note.id,
        updatedNoteDto,
        user.id,
      );
      expect(updatedNote).toMatchObject({
        title: updatedNoteDto.title,
        content: updatedNoteDto.content,
      });
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const user = await userService.createUser(generateUserDto());
      const noteDto = generateNoteDto();
      const note = await service.createNote(noteDto, user.id);
      await service.deleteNote(note.id, user.id);
      expect(service.getNote(note.id, user.id)).rejects.toThrow(
        NoteNotFoundException,
      );
    });
  });
});
