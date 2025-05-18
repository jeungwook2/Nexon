import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Events & Document;

//출석 일수별 보상지급을 위한 코드
interface Step {
  day: number;
  reward: string;
}

@Schema({ collection: 'events', timestamps: true })
export class Events {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'EventCondition', required: true, index: true })
  conditionCode: Types.ObjectId;
  
  @Prop({ type: Object})
  conditionParams: Record<string, any>;
  
  @Prop({ type: [Object],default:[] })
  steps: Step[];

  @Prop({ required: true })
  startAt: Date;

  @Prop()
  endAt: Date;

  @Prop({ default: 'ACTIVE' })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(Events);
