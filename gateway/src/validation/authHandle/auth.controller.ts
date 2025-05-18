import { Controller, Get, UseGuards, Request, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../jwt/jwt-auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { Role } from '../jwt/role-guard/roles.enum';
import { Roles } from '../jwt/role-guard/roles.decorator';
import { RolesGuard } from '../jwt/role-guard/roles.guard';
import { CreateUserDto } from '../userdto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService:AuthService){}

 // JWT 검증 수행
  @UseGuards(JwtAuthGuard) 
  @Get()
  getProfile(@Request() req) {
    return req.user;
    // req.user 토큰에 저장되어있는 값
  }

  @Post('auth/login')
  async authLogin(@Body() loginDto: { email: string; pwd: string }) {
     //예외를 이미 잡아서 던지기때문에 따로 예외처리를 하지 않았습니다.
    
      return this.authService.authLogin(loginDto);
    
  }
  @Get('setting')
  async setting(){
    //예외를 이미 잡아서 던지기때문에 따로 예외처리를 하지 않았습니다.
      return this.authService.setting();
  }
  @Post('user/insert')
  async userInsert(@Body() userDto:CreateUserDto){
    return this.authService.userInsert(userDto);
  }
  
  @Post('admin/login')
  async adminLogin(@Body() loginDto: {email:string;pwd:string}){
    return this.authService.adminLogin(loginDto);
  }
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @Get('test')
  async test(){
    return "Hello";
  }


}
