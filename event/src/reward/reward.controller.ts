import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('events/reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  create(@Body() createRewardDto: CreateRewardDto) {
    console.log("들어온 정보 ::",createRewardDto);
    
    return this.rewardService.createReq(createRewardDto);
  }

  @Get()
  findAll() {
    return this.rewardService.findAll();
  }
  
}//class
