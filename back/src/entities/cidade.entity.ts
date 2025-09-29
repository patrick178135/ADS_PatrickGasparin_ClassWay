import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cidade {
  @PrimaryGeneratedColumn()
  ID_cidade: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 2 })
  UF: string;
}