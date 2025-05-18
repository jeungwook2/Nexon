import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//index 생성및 참조용
@Schema({collection: 'user'})
export class User extends Document {
  @Prop({ required: true,unique: true})
  email: string;

  @Prop({ required: true })
  pwd: string;

  @Prop({ required: true })
  nick: string;

  @Prop({ required: true ,default:'user'})
  role: string;

  @Prop({ required: true ,enum:['Y','N'],default:'N'})
  delYn: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
