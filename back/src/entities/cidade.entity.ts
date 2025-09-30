import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cidade {
  @PrimaryGeneratedColumn()
  ID_cidade: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @Column({ length: 2 })
  @IsNotEmpty()
  UF: string;
}