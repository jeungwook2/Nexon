import { Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reward } from './schema/reward.schema';
import { Model } from 'mongoose';
import { Events } from 'src/events/schema/eventschema';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private userRewardModel: Model<Reward>,
  @InjectModel(Events.name) private eventModel: Model<Events>){}

  async createReq(createRewardDto: CreateRewardDto):Promise<any> {
    //유니크로 설정된 이벤트 이름을 가지고 _id 값 찾아오기
    const eventId = await this.eventModel.findOne({title:createRewardDto.eventTitle,status:"ACTIVE"}).exec()
    if(eventId){
      createRewardDto.eventId = eventId._id;
    }else{
      throw new Error("존재하지 않는 이벤트 입니다.")
    }
    //insert
    const rewardObj = new this.userRewardModel(createRewardDto)
    return  rewardObj.save();
  }

  findAll() {
    return `This action returns all reward`;
  }

}//class
