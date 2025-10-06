import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, isInt, IsInt, IsNotEmpty, IsString, MaxLength, Min, min, MinLength } from "class-validator";

export class CreateValidacaoDto {
  
    @IsString()
    tipo_evento: string;

    @IsDate()
    @Type(() => Date)
    data: Date;
  
    @IsInt()
    @Min(1)
    aluno: number;

    @IsInt()
    @Min(1)
    parada: number;

    @IsInt()
    @Min(1)
    viagem: number;

}