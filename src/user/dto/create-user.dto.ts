import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please, enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
