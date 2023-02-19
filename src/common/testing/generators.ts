import { faker } from '@faker-js/faker';
import { CreateNoteDto } from '../../note/dto/create-note.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export const generateNoteDto = () => {
  const noteDto = new CreateNoteDto();
  noteDto.title = faker.lorem.sentence();
  noteDto.content = faker.lorem.paragraph();

  return noteDto;
};

export const generateUserDto = () => {
  const userDto = new CreateUserDto();
  userDto.email = faker.internet.email();
  userDto.firstName = faker.name.firstName();
  userDto.lastName = faker.name.lastName();
  userDto.password = faker.internet.password();

  return userDto;
};
