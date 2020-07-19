import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule],
})
export class AppModule {
  constructor(private connection: Connection) { }
}
