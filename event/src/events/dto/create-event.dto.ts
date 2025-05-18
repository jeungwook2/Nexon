import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from "class-validator";
import { EventDocument } from "../schema/eventschema";
import { Type } from "class-transformer";
import { Types } from "mongoose";


class ConditionParamsDto {
  [key: string]: any;
}
//출석 일수별 보상지급을 위한 코드
class StepDto {
  day: number;
  reward: string;
}

export class CreateEventDto {

    save(): EventDocument | Promise<EventDocument> {
      throw new Error('Method not implemented.');
    }

      @IsString()
      title:string;
      // 추후 service에서 값을 채워주기위해 옵션등록
      @IsOptional()
      @IsString()
      conditionId: Types.ObjectId;

      @IsString()
      conditionCode:string;

      @ValidateNested()
      @Type(() => ConditionParamsDto)
      conditionParams: ConditionParamsDto;
    
      @IsArray()
      @ValidateNested({ each: true })
      @Type(() => StepDto)
      steps: StepDto[];

      @IsDate()
      @Type(() => Date)
      startAt: Date;
    
      @IsDate()
      @IsOptional()
      @Type(() => Date)
      endAt: Date;

}
