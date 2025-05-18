import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventConditionDocument = EventCondition & Document;

@Schema({ collection: 'event_conditions' })
export class EventCondition {

  @Prop({required:true,unique:true})
  code:string;

  @Prop({ required: true})
  name: string; 

}
export const EventConditionSchema = SchemaFactory.createForClass(EventCondition);