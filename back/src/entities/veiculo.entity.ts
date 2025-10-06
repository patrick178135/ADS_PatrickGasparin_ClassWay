import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Viagem } from "./viagem.entity";

@Entity()
export class Veiculo {
  @PrimaryGeneratedColumn()
  ID_veiculo: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  montadora: string;
  
  @Column({ length: 255 })
  @IsNotEmpty()
  modelo: string;

  @Column()
  @IsNotEmpty()
  placa: string;

  @Column()
  @IsNotEmpty()
  capacidade: number;

  @Column()
  @IsNotEmpty()
  ativo: boolean;

  @OneToMany( () => Viagem , viagem => viagem.veiculo)
  @JoinColumn({ name: 'viagens' }) 
  viagens: Viagem[];
}