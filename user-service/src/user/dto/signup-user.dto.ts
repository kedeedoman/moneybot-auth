import { IsNotEmpty } from 'class-validator';

export class SignUpUserDto {
  @IsNotEmpty({message: "token is mandatory"})
  readonly token: string;
}