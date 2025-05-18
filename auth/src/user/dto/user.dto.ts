
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  save(): import("../schema/user.schema").User | PromiseLike<import("../schema/user.schema").User> {
    throw new Error('Method not implemented.');
  }
  @IsEmail()
  email: string;

  @IsString()
  pwd: string;

  @IsString()
  nick: string;

  @IsString()
  role: string;

  
}
