import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuizzDto {
    @IsString()
    title: string;

    // Validate every question
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    questions: any[];
}
