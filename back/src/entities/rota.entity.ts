import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rota {
  @PrimaryGeneratedColumn()
  ID_rota: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

}