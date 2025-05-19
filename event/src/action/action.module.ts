import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Action, ActionSchema } from './schema/action.schema';
import { Events, EventSchema } from 'src/events/schema/eventschema';
import { Reward, RewardUserSchema } from 'src/reward/schema/reward.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
    MongooseModule.forFeature([{ name: Events.name, schema: EventSchema }]),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardUserSchema }]),
  ],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
