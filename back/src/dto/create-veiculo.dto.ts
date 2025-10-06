import { IsBoolean, IsEmail, isInt, IsInt, IsNotEmpty, IsString, MaxLength, Min, min, MinLength } from "class-validator";

export class CreateVeiculoDto {
  
    @MinLength(3)
    @MaxLength(100)
    montadora: string;

    @MinLength(3)
    @MaxLength(100)
    modelo: string;
    
    @IsString()
    placa: string;
  
    @IsInt()
    @Min(1)
    capacidade: number;

    @IsBoolean()
    ativo: boolean

}