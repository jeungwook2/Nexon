import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";


export type ActionDocument = Action & Document;

@Schema({ collection: 'user_action'})
export class Action {

  @Prop({required:true,index:true})
  userId:string;

  @Prop({ required: true})
  eventTitle: string; 

  @Prop({ type: [Date], default: [] })
  checkedDates: Date[];

}
export const ActionSchema = SchemaFactory.createForClass(Action);