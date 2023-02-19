import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Note } from '../note/note.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  @ApiHideProperty()
  password: string;

  @OneToMany(() => Note, 'owner')
  @Exclude()
  @ApiHideProperty()
  notes: Note[];

  constructor(email: string, firstName: string, lastName: string) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  async setPassword(password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
