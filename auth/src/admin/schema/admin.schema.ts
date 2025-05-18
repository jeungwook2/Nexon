import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({collection: 'admin'})
export class Admin extends Document {
    @Prop({ required: true,unique: true})
    email: string;
  
    @Prop({ required: true })
    pwd: string;
  
    @Prop({ required: true ,enum: ['AUDITOR', 'ADMIN','OPERATOR']})
    role: string;
  }
  export const AdminSchema = SchemaFactory.createForClass(Admin);

  