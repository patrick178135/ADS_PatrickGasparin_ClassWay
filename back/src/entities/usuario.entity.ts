import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_usuario: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @Column()
  @IsNotEmpty()
  CPF: number;
  
  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  senha: string;

  @Column()
  ativo: boolean;

}