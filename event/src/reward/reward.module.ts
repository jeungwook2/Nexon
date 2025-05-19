import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Events, EventSchema } from 'src/events/schema/eventschema';
import { EventCondition, EventConditionSchema } from 'src/event_conditions/schema/eventConditionSchema';
import { Reward, RewardUserSchema } from './schema/reward.schema';

@Module({
   imports: [
        MongooseModule.forFeature([{ name: Events.name, schema: EventSchema }]),
        MongooseModule.forFeature([{ name: EventCondition.name, schema: EventConditionSchema }]),
        MongooseModule.forFeature([{ name: Reward.name, schema: RewardUserSchema }]),
      ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
