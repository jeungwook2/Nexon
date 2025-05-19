import { Controller, Get, Post, Body, Patch, Param, Delete,Request } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  // 요청 보내기
  @Post()
  async create(@Body() createActionDto: CreateActionDto) {
    console.log("컨트롤러 들어온값 : ",createActionDto);
    try{
      return await this.actionService.create(createActionDto);
    }catch(err){
      return {err:err.message};
    }
    
  }

  // 유저 요청내역 확인하기
  @Get('user')
  findAllByUser(@Request() req) {
    console.log("들어온 값 : ",req.get);
    const token = req.get('Authorization').replace('Bearer', '');
    //토큰에 혹시모를 공백제거
    const cleanToken = token.trim();
    console.log("controllerToken ::",cleanToken);
    return this.actionService.findAllByUser(cleanToken);
  }

  @Get('admin')
  findAllByAdmin() {
    return this.actionService.findAllByAdmin();
  }
}
