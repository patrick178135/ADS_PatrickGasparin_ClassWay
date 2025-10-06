import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEmail, isInt, IsInt, IsNotEmpty, MaxLength, Min, min, MinLength } from "class-validator";

export class CreateViagemDto {
  
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @IsDate()
    @Type(()=> Date)
    data: Date;

    @IsInt()
    @Min(1)
    admin: number;
  
    @IsInt()
    @Min(1)
    motorista: number;

    @IsInt()
    @Min(1)
    rota: number;

    @IsInt()
    @Min(1)
    veiculo: number;

}