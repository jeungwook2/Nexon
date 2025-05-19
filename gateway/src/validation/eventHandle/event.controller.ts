import { Body, Controller, Post, UseGuards,Request, Get, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../jwt/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../jwt/role-guard/roles.guard';
import { Role } from '../jwt/role-guard/roles.enum';
import { Roles } from '../jwt/role-guard/roles.decorator';
import { EventDto } from './eventDto/eventdto';
import { CreateRewardDto } from './rewardDto/rewardDto';

@Controller('events')
export class EventController {
  constructor(private eventService:EventService){}

  //보상요청 테스트용
  // @UseGuards(JwtAuthGuard,RolesGuard)
  // @Roles(Role.ADMIN, Role.USER)
  // @Post('reward')  
  // async rewardReq(@Request() req ,@Body() title:{eventTitle:string}){
  //   // return req.user;
    
  //   return this.eventService.rewardReq(req.user.email,title);
  // }

  //이벤트 등록하기 (관리자용)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN,Role.AUDITOR,Role.OPERATOR)
  @Post()
  async insertEvent(@Body() eventDto:EventDto){
    try{
      return this.eventService.insertEvent(eventDto);
    }catch(err){
      return {err:err.message};
    }
    
  }
  


// 출석체크 보상요청
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post('attendance')  
  async attendanceReq(@Request() req ,@Body() title:{eventTitle:string}){
    // return req.user;
    
    return this.eventService.attendanceReq(req.user.email,title);
  }
// 유저가 요청 확인하기
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('user')
  async getUserReqList(@Request() req) {
    const token = req.get('authorization');
    console.log("token :: ",token);
    
    return await this.eventService.getUserReqList(token);
    // console.log("토큰정보::",req.user);
  }
//관리자 모든 요청 확인기능
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN,Role.AUDITOR,Role.OPERATOR)
  @Get('admin')
  async getAdminReqList(@Request() req) {
    const token = req.get('authorization');
    console.log("token :: ",token);
    
    return await this.eventService.getAdminReqList(token);
    // console.log("토큰정보::",req.user);
  }

  //이벤트 목록조회는 모두가 가능해야 한다고 생각해서 토큰값을 별도로 검증하지 않았습니다.
  @Get('list')
  async getEventList(){
    return await this.eventService.getEventList();
  }
  // 이벤트 상세조회
  @Get('list/:id')
  async getEventDetail(@Param('id') id: string){
    console.log(id);
    return await this.eventService.getEventDetail(id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN,Role.AUDITOR,Role.OPERATOR)
  @Post('reward/add')
  async getAddReward(@Body() inputDto:CreateRewardDto){
    console.log(inputDto);
    
    return await this.eventService.getAddReward(inputDto);
  }

}//class
