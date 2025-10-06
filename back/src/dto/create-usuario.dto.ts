import { IsBoolean, IsEmail, isInt, IsInt, IsNotEmpty, MaxLength, Min, min, MinLength } from "class-validator";

export class CreateUsuarioDto {
  
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @MaxLength(11)
    CPF: string;
    
    @IsEmail()
    email: string;
  
    @MinLength(5)
    senha: string;

    @IsBoolean()
    ativo: boolean

    @IsInt()
    @Min(1)
    perfil_usuario: number;
  
    @IsInt()
    @Min(1)
    cidade: number;

}