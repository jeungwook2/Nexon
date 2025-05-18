import { Body, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Events } from './schema/eventschema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventCondition } from 'src/event_conditions/schema/eventConditionSchema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Events.name) private eventModel: Model<Events>
  ,@InjectModel(EventCondition.name)private eventConditionModel: Model<EventCondition>){}

  async createEvent(@Body() createEventDto: CreateEventDto):Promise<any> {
    
    const eventCode = createEventDto.conditionCode;
    const eventId = await this.eventConditionModel.findOne({code:eventCode}).exec();

    if (!eventId) {
      throw new Error('존재하는 이벤트코드가 없습니다.');
    }
    createEventDto.conditionId = eventId._id;
    
    const eventDB = new this.eventModel(createEventDto);
    return eventDB.save();
  }
// 이벤트 코드 조회하기 어떤 이벤트를 등록할 수 있는지 표시하기 위함.
  async eventCodefindAll() {
    return await this.eventConditionModel.find().exec();
  }

  async activeEventfindAll() {
    return await this.eventModel.find().exec();
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
