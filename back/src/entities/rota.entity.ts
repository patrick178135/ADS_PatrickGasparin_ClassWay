import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rota {
  @PrimaryGeneratedColumn()
  ID_rota: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

}