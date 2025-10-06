import { IsArray, IsInt, IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

export class CreateRotaDto {
  
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    partida: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    destino : number;

    @IsArray()
    paradas: number[];
}
