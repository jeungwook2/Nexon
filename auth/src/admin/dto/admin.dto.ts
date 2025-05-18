import { IsEmail, IsString } from "class-validator";

export class CreateAdminDto {
  save(): import("../schema/admin.schema").Admin | PromiseLike<import("../schema/admin.schema").Admin> {
      throw new Error('Method not implemented.');
    }
    @IsEmail()
    email: string;
  
    @IsString()
    pwd: string;
  
    @IsString()
    role: string;
}
