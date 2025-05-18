import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async gethello(){
    return "hello";
  }
  @Get('setting')
  async eventInsert(){
    try{
      return await this.eventService.eventInsert();
    }catch(err){
      return {errMsg:err.message}
    }
  
  }
  

}
