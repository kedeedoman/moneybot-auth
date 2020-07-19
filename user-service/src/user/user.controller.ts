import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

  @Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  signUpUser(@Body(new ValidationPipe()) signUpUserDto: SignUpUserDto): Promise<User> {
    return this.userService.signUpUser(signUpUserDto);
  }
}
