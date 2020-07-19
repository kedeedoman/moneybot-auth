import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';
import {IsEmail, IsNotEmpty} from 'class-validator'

@Entity('users')
@Unique(['email'])
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @IsNotEmpty({message: 'email is mandatory'})
  @IsEmail({}, {message: 'invalid email'})
  @Column({nullable: false})
  email: string;

  @Column({nullable: false})
  createdDate: number;
}