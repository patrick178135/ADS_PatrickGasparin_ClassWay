import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCidadeDto {
  
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(2)
    @IsString()
    UF: string;
}