import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Veiculo {
  @PrimaryGeneratedColumn()
  ID_veiculo: number;

  @Column({ type: 'varchar', length: 255 })
  montadora: string;
  
  @Column({ type: 'varchar', length: 255 })
  modelo: string;

  @Column({ type: 'varchar', length: 7 })
  placa: string;

  @Column()
  capacidade: number;

  @Column()
  ativo: boolean;
}