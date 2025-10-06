import { IsInt, IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

export class CreateParadaDto {
  
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    cidade: number;
}
