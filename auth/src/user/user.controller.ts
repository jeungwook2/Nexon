import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express'; 
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.findAll();
    return users;
  }
  @Post('create')
  async join(@Body() userdto:CreateUserDto) {
    if(userdto.email==null){
      return{message:"유저등록 실패",err:"이메일 누락"}
    }
    if(userdto.pwd==null){
      return{message:"유저등록 실패",err:"비밀번호 누락"}
    }
    if(userdto.nick==null){
      return{message:"유저등록 실패",err:"닉네임 누락"}
    }

    try{
      const join = await this.userService.insert(userdto);
      return {dto : join,message : "유저등록 성공"};
    }catch(err){
      return {message : "이미 가입된 이메일입니다. (회원가입 실패)",err};
    }
  }

  @Post('login')
  async userlogin(@Res({passthrough:true})res:Response, @Body() userdto:CreateUserDto){
    if(userdto.email==null){
      return{message:"다시 입력하세요",err:"이메일 누락"}
    }
    if(userdto.pwd==null){
      return{message:"다시 입력하세요",err:"비밀번호 누락"}
    }
    try{
    const token = await this.userService.userlogin(userdto);
    return token;
  }
    catch{
      return{message:"로그인 실패",err:"토큰 발행실패"}
    }
    
  }
  

}
