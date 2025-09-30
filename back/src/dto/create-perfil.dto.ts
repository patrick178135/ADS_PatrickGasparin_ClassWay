import { IsNotEmpty, MaxLength } from "class-validator";

export class CreatePerfilDto {

    @IsNotEmpty()
    @MaxLength(255)
    nome: string;
}