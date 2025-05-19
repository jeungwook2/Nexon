import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { EventDto } from './eventDto/eventdto';
import { CreateRewardDto } from './rewardDto/rewardDto';

@Injectable()
export class EventService {
    constructor(private  httpService: HttpService,private config: ConfigService,) {}
    

    //관리자 이벤트 등록
  async insertEvent(eventDto:EventDto):Promise<any>{

    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/events";
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, eventDto),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }



  //유저 보상요청
  async rewardReq(req: Request, title:{eventTitle:string}):Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/events/reward";
    
    const userRequest = {
      userId:req,
      eventTitle:title.eventTitle
    }
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, userRequest),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }
  // 유저 출석체크 요청 및 보상지급
  async attendanceReq(req: Request, title:{eventTitle:string}):Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/action";

    const userRequest = {
      userId:req,
      eventTitle:title.eventTitle
    }
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, userRequest),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }

  //유저 개인 요청내역 가져오기
  async getUserReqList(token: string):Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/action/user"; 
    try {
      const response = await firstValueFrom(
        this.httpService.get(url,{
          headers:{
            Authorization:token,
          },
        }),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }
// 관리자 유저들의 요청 내역 모두 가져오기
  async getAdminReqList(token: string):Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/action/admin"; 
    try {
      const response = await firstValueFrom(
        this.httpService.get(url,{
          headers:{
            Authorization:token,
          },
        }),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }
  //이벤트 리스트 받아오기
  async getEventList():Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/events/list"; 
    try {
      const response = await firstValueFrom(
        this.httpService.get(url),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }

  //이벤트 상세조회
  async getEventDetail(id:string):Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/events/list/"+id; 
    console.log(url);
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }
  //이벤트 보상 추가하기
  async getAddReward(inputDto:CreateRewardDto):Promise<any>{
    const url = this.config.get<string>('EVENT_SERVICE_URL')+"/events/addreward"; 
    console.log(url);
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(url,inputDto),
      );
      return response.data;  
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
  }

}//class

