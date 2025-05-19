import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Events & Document;

// 일수별 추가될 수 있는 보상을 객체화 하여 확장성을 생각했습니다.
interface Reward {
  name: string;
  count: number;
}

//출석 일수별 보상지급을 위한 코드
interface Step {
  day: number;
  reward: Reward[];
}

@Schema({ collection: 'events', timestamps: true })
export class Events {
  @Prop({ required: true,unique:true })
  title: string;

  @Prop({required: true})
  conditionCode:string;

  @Prop({ type: Types.ObjectId, ref: 'EventCondition', required: true, index: true })
  conditionId: Types.ObjectId;
  
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
