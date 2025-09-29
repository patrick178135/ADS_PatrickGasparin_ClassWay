import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Parada {
  @PrimaryGeneratedColumn()
  ID_parada: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

}