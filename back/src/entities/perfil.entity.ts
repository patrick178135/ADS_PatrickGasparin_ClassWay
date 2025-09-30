import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Perfil {
  @PrimaryGeneratedColumn()
  ID_perfil: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

}