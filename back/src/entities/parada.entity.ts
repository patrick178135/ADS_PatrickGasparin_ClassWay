import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Parada {
  @PrimaryGeneratedColumn()
  ID_parada: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

}