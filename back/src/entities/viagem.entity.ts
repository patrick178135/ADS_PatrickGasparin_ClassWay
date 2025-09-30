import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Viagem {
  @PrimaryGeneratedColumn()
  ID_viagem: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @Column()
  @IsNotEmpty()
  data: Date;

}