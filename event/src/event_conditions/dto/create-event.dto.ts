import { IsString} from 'class-validator';
import { EventConditionDocument } from '../schema/eventConditionSchema';

export class CreateEventDto {

  save(): EventConditionDocument | Promise<EventConditionDocument> {
    throw new Error('Method not implemented.');
  }

  @IsString()
  code:string;

  @IsString()
  name: string;

}

