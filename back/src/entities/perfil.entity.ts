import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Perfil {
  @PrimaryGeneratedColumn()
  ID_perfil: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

}