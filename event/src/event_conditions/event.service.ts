import {  Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventCondition } from './schema/eventConditionSchema';

@Injectable()
export class EventService {
  constructor(@InjectModel(EventCondition.name) private eventConditionModel: Model<EventCondition>){}

  async eventInsert():Promise<any>{
    //출석 이벤트 셋팅용
    const attendance = {
      code: "ATTENDANCE",
      name: "출석 이벤트",
    }
    
    //초대 이벤트 셋팅용
    const friendInvite = {
      code: "INVITE",
      name: "초대 이벤트",
    }
    //중복 등록 방지
    const realDB =  await this.eventConditionModel.find({code:attendance.code}).exec()
    const realDB2 =  await this.eventConditionModel.find({code:friendInvite.code}).exec()

    if (realDB.length > 0 || realDB2.length > 0) {
      throw new Error("이미 등록된 코드들입니다");
    }

    const attendanceSetting = new this.eventConditionModel(attendance);
    attendanceSetting.save();
    const friendInviteSetting = new this.eventConditionModel(friendInvite);
    friendInviteSetting.save();

      return "이벤트 코드 Setting OK";

    
  }
}//class
