
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserReward = Reward & Document;

@Schema({ collection: 'user_request',timestamps:true})
export class Reward  {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventTitle: string;

  @Prop({type: Types.ObjectId, ref: 'Events', required: true, index: true})
  eventId: Types.ObjectId;

  @Prop({ required: true ,default:'false'})
  success: string;

  @Prop({ type: Object })
  todayStep: Record<string, any>;

  @Prop()
  processedAt:Date;
}

export const RewardUserSchema = SchemaFactory.createForClass(Reward);
