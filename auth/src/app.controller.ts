import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getbye(): string {
    return this.appService.getBye();
  }
  @Post('/join')
  login(@Body() loginDto: { username: string; password: string }): string {
    const { username, password } = loginDto;
    return `로그인 시도: ${username}`;
  }
}
