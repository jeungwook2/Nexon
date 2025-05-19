import { Body, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Events } from './schema/eventschema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventCondition } from 'src/event_conditions/schema/eventConditionSchema';
import { CreateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Events.name) private eventModel: Model<Events>
  ,@InjectModel(EventCondition.name)private eventConditionModel: Model<EventCondition>){}

  async createEvent(@Body() createEventDto: CreateEventDto):Promise<any> {
    
    const eventCode = createEventDto.conditionCode;
    const eventId = await this.eventConditionModel.findOne({code:eventCode}).exec();

    //중복 제거
    const eventinit = await this.eventModel.findOne({title:createEventDto.title}).exec();
    
    if(eventinit){
      throw new Error("이미 등록된 이벤트 입니다.")
    }

    if (!eventId) {
      throw new Error('존재하는 이벤트코드가 없습니다.');
    }
    createEventDto.conditionId = eventId._id;
    console.log("dto에 담겨진 내용 ::: ",createEventDto)
    
    const eventDB = new this.eventModel(createEventDto);
    return eventDB.save();
  }
// 이벤트 코드 조회하기 어떤 이벤트를 등록할 수 있는지 표시하기 위함.
  async eventCodefindAll() {
    return await this.eventConditionModel.find().exec();
  }

  async activeEventFindAll() {
    const eventList =await this.eventModel.find().exec();

    return eventList.map(event => ({
      id : event.id,
      title: event.title,
      startAt:event.startAt,
      endAt:event.endAt,
    }));
  }

  async activeEventDetail(id:string):Promise<any>{
    const event =await this.eventModel.findOne({_id:id}).exec();
    console.log(event);
    
    return event;
  }
  async addReward(inputDto:CreateRewardDto){
    console.log("여기까지 넘어온 값 ",inputDto);

    const inputObj = {
      name:inputDto.name,
      count:inputDto.count
    }

    const event = await this.eventModel.findOne({title:inputDto.title});
    if(event){
      const step = await event.steps.find(step => step.day === inputDto.day);
      console.log("step ::: ",step);

      if(step){
        const result = await this.eventModel.updateOne(
          {
            title: inputDto.title,
            "steps.day": inputDto.day
          },
          {
            $push: {
              "steps.$.reward": inputObj
            }
          }
        );
        //업데이트가 실행되지 않았을때
        if (result.modifiedCount === 0) {
          return { message: "업데이트된 문서가 없습니다. 제목 또는 day 값 확인 필요." };
        }

      }else {
        return { message: "해당 일차(step)를 찾을 수 없습니다." };
      }
    } else {
      return { message: "해당 이벤트를 찾을 수 없습니다." };
    }
    
    return { message: "보상 추가 완료" };
    
  }
}//class
