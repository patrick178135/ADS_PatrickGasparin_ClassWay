import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Viagem {
  @PrimaryGeneratedColumn()
  ID_viagem: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column()
  data: Date;

}