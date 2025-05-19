import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateRewardDto } from './dto/update-reward.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    // console.log("dto::",createEventDto);
    try{
      return await this.eventsService.createEvent(createEventDto);
    }catch(err){
      return {err:err.message};
    }
    
  }
  @Get()
  eventCodefindAll() {
    return this.eventsService.eventCodefindAll();
  }
  @Get('list')
  activeEventFindAll() {
    return this.eventsService.activeEventFindAll();
  }

  @Get('list/:id')
  activeEventDetail(@Param('id') id: string) {
    console.log("들어온 값 :: ",id);
    return this.eventsService.activeEventDetail(id);
  }

  @Post('addreward')
  async addReward(@Body() inputDto:CreateRewardDto){
    return await this.eventsService.addReward(inputDto);
  }

}
