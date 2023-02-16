import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please, enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsNotEmpty({ message: 'firstName is required' })
  lastName: string;

  @IsNotEmpty({ message: 'firstName is required' })
  password: string;
}
