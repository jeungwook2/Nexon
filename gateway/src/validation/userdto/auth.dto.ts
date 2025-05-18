
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  pwd: string;

  @IsString()
  nick: string;
  
}
