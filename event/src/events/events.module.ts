import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Events, EventSchema } from './schema/eventschema';
import { EventCondition, EventConditionSchema } from 'src/event_conditions/schema/eventConditionSchema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Events.name, schema: EventSchema }]),
      MongooseModule.forFeature([{ name: EventCondition.name, schema: EventConditionSchema }]),
    ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
