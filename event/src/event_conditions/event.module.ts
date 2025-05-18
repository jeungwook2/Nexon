import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventCondition, EventConditionSchema } from './schema/eventConditionSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventCondition.name, schema: EventConditionSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
