import { IsArray,IsObject, IsString } from "class-validator";
import { ActionDocument } from "../schema/action.schema";


export class CreateActionDto {

    save(): ActionDocument | Promise<ActionDocument> {
        throw new Error('Method not implemented.');
      }

  @IsString()
  userId:string;

  @IsString()
  eventTitle: string;

  @IsString()
  success: string;
  
  @IsArray()
  checkedDates:Date[];

  @IsObject()
  todayStep:object;
}
