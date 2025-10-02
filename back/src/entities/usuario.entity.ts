import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, IntegerType, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from "./perfil.entity";
import { Cidade } from "./cidade.entity";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_usuario: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @Column({ type: 'varchar', length: 11 })
  @IsNotEmpty()
  CPF: string;  
  
  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  senha: string;

  @Column()
  @IsNotEmpty()
  ativo: boolean;

  
  @OneToOne(() => Perfil)
  @Column()
  @IsNotEmpty()
  perfil: number;

  @OneToOne(() => Cidade)
  @Column()
  @IsNotEmpty()
  cidade: number;

}