import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpUserDto } from './dto/signup-user.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  static async getEmailFromToken(token: string): Promise<string> {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token
    });
    const payload = ticket.getPayload();
    if (!payload.email) {
      throw Error("Received Payload: " + payload);
    }
    return payload.email;
  }

  async signUpUser(signUpUserDto: SignUpUserDto): Promise<User> {
    const email: string = <string>await UserService.getEmailFromToken(signUpUserDto.token)
      .catch((error) => {
        console.warn("Failed to get email from token: " + error)
      })
    const existingUser = await this.userRepository.findOne({ where: { "email": email } });
    if (existingUser) {
      return existingUser;
    }
    const user = new User();
    user.email = email;
    user.createdDate = new Date().getTime();
    return this.userRepository.save(user);
  }

  async getUserFromEmail(email: string): Promise<User> {
    return this.userRepository.findOne({"email": email})
  }
}
