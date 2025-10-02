import { IsEmail, isInt, IsInt, IsNotEmpty, MaxLength, Min, min, MinLength } from "class-validator";

export class CreateUsuarioDto {
  
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @IsNotEmpty()
    @MaxLength(11)
    CPF: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    @MinLength(5)
    senha: string;

    @IsNotEmpty()
    ativo: boolean

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    perfil: number;
  
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    cidade: number;

}