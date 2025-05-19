import { IsString, IsInt } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  title: string;

  @IsString()
  name: string;

  @IsInt()
  count: number;

  @IsInt()
  day: number;
}