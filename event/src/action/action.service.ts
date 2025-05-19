import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './schema/action.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Events } from 'src/events/schema/eventschema';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Reward, UserReward } from 'src/reward/schema/reward.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { response } from 'express';


//한국 시간으로 날짜를 포맷하기 위함
function kst(date: Date): Date {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const kst = new Date(date.getTime() + KST_OFFSET);
  return new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()));
}


// 날짜 차이를 구하기 위함
  function getFormatDate(startAt: Date, today: Date = new Date()): number {
    // 한국 시간 offset(ms)
    const KST_OFFSET = 9 * 60 * 60 * 1000;
  
    // UTC 시간을 KST 시간으로 변환 (밀리초 단위)
    const startKST = new Date(startAt.getTime() + KST_OFFSET);
    const todayKST = new Date(today.getTime() + KST_OFFSET);
  
    // 한국 시간 기준 연도, 월, 일만 추출해서 UTC 0시 기준 날짜 생성
    const startDateOnly = Date.UTC(startKST.getUTCFullYear(), startKST.getUTCMonth(), startKST.getUTCDate());
    const todayDateOnly = Date.UTC(todayKST.getUTCFullYear(), todayKST.getUTCMonth(), todayKST.getUTCDate());
  
    // 날짜 차이 계산
    const diffTime = todayDateOnly - startDateOnly;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
    // console.log('startDateOnly:', new Date(startDateOnly));
    // console.log('todayDateOnly:', new Date(todayDateOnly));
    // console.log('diffDays:', diffDays);
  
    return diffDays;
  }

@Injectable()
export class ActionService {
constructor(@InjectModel(Action.name) private actionModel: Model<Action>,
@InjectModel(Events.name) private eventModel: Model<Events>,private configService: ConfigService,
@InjectModel(Reward.name) private useRewardModel: Model<UserReward>,
private  httpService: HttpService,
){}

// UserReward 출석체크 + 보상요청
  async create(createActionDto: CreateActionDto) {
    
    //시작일 가져와서 함수로 값 구하기위함
    const eventDB= await this.eventModel.findOne({title:createActionDto.eventTitle,status:"ACTIVE"});
    console.log("이벤트 시작일::",eventDB?.startAt);
    // console.log("현재일 :::",new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
      // console.log(eventDB);
      console.log("한국시간 현재시간 date 타입 :",kst(new Date()));
      

    if(eventDB){
      // 함수 호출하여 이벤트에 등록된 day값과 비교하기위해 지금과 시작일의 차이를 구하기위함
      const day = getFormatDate(eventDB?.startAt);
      const event = await this.eventModel.findOne({ title:createActionDto.eventTitle,status:"ACTIVE"});
      // console.log("day",day);
      // console.log("day",event);

      if(event){
      // 날짜 차이별로 보상일수를 얻을 수 있으니 보상일수에 해당하는 데이터를 추출 dto에 대입
      const todayStep = event.steps.find(step => step.day === day);
      console.log("todayStep",todayStep);

      if(todayStep){
        createActionDto.todayStep=todayStep;
      }
      }

      // 오늘날짜를 자정기준으로 치환후 배열에 저장 = 중복저장 방지를 위해서 
      createActionDto.checkedDates=[kst(new Date())];
      if(eventDB?.startAt > kst(new Date())){
        throw new Error("아직 시작하지 않은 이벤트 입니다.");
      }
      if(eventDB?.endAt < kst(new Date())){
        throw new Error("종료된 이벤트 입니다.");
      }
    }else{
      throw new Error("이벤트 기간을 확인해 주세요.")
    }
    

    const realDb = await this.actionModel.findOne({userId:createActionDto.userId,eventTitle:createActionDto.eventTitle})
    if(realDb){
      const alreadyChecked = realDb.checkedDates.some(date => {
        return new Date(date).getTime() === kst(new Date()).getTime();
      });
      //some 결과가 있으면 true / false 형식으로 반환
      if(alreadyChecked){
        const actionDB = new this.actionModel(createActionDto);
        //요청 다시 넘겨주기 요청 성공/실패 기록하기 위해서
        const url = this.configService.get('EVENT_SERVICE_URL')+"/events/reward";
      try {
        const response = await firstValueFrom(
          this.httpService.post(url,createActionDto),
        );
          console.log(response.data);
        } catch (error) {
          // 에러 핸들링
          throw new Error('요청실패 ~~ failed: ' + error.message);
        }
        // console.log("실행됨 ===== 결과 :::",alreadyChecked);
        throw new Error("이미 참여한 이벤트 입니다 / 보상을 이미 받으셨습니다.");
      }
      return await this.actionModel.updateOne(
        { userId: createActionDto.userId, eventTitle: createActionDto.eventTitle },
        { $addToSet: { checkedDates: kst(new Date()) } }
     
    );
    }
    createActionDto.success ="ture";
    const actionDB = new this.actionModel(createActionDto);
    //요청 다시 넘겨주기 요청 성공/실패 기록하기 위해서
    const url = this.configService.get('EVENT_SERVICE_URL')+"/events/reward";
    try {
      const response = await firstValueFrom(
        this.httpService.post(url,createActionDto),
      );
      console.log(response.data);
    } catch (error) {
      // 에러 핸들링
      throw new Error('요청실패 ~~ failed: ' + error.message);
    }
    console.log("최종적으로 만들어진 dto",createActionDto);
      return actionDB.save();
    
   
  }

  async findAllByUser(token: string):Promise<any> {
    console.log("service Token:",token);
    //.env 파일 참조
    const secret = this.configService.get('JWT_SECRET');
    console.log("this start",secret);
    
    try {
      //토큰 해독 , 타입을 Payload 값으로 단언해서 필드값 추출가능하도록
      const decodedToken = await jwt.verify(token, secret)as jwt.JwtPayload;
      
      console.log(decodedToken.email);
      const userDB = await this.actionModel.find({userId:decodedToken.email});
      const userReq = await this.useRewardModel.find({userId:decodedToken.email})

      const responseDB = {userDB,userReq}
      return responseDB;
    } catch (err) {
      console.error("JWT 해독 오류:", err);
    }
    
    
    // const realDb = await this.actionModel.findOne({userId:createActionDto.userId})
    return "good";
  }

  //관리자용 유저 모든 요청내역 확인하기
  async findAllByAdmin():Promise<any>{
      const userDB = await this.actionModel.find();
      const userReq = await this.useRewardModel.find();
      const responseDB = {userDB,userReq}
      return responseDB;

  }
}
