import { IsObject, IsString } from "class-validator";
import { UserReward } from "../schema/reward.schema";
import { Types } from "mongoose";

export class CreateRewardDto {
     save(): UserReward | Promise<UserReward> {
          throw new Error('Method not implemented.');
        }
     @IsString()
     eventTitle:string;

     @IsString()
     eventId:Types.ObjectId;

     @IsString()
     userId:string;

     @IsString()
     success: string;

     @IsObject()
     todayStep:object;

      
}
