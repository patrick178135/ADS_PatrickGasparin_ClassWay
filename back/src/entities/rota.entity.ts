import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cidade } from "./cidade.entity";
import { Parada } from "./parada.entity";
import { Viagem } from "./viagem.entity";

@Entity()
export class Rota {
  @PrimaryGeneratedColumn()
  ID_rota: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @ManyToOne(() => Cidade, cidade => cidade.ID_cidade)
  @JoinColumn({ name: 'partida' })
  @Column()
  @IsNotEmpty()
  partida: number;

  @ManyToOne(() => Cidade, cidade => cidade.ID_cidade)
  @JoinColumn({ name: 'destino' })
  @Column()
  @IsNotEmpty()
  destino : number;

  @ManyToMany(() => Parada, (parada:Parada) => parada.rotas)
  @JoinTable()
  paradas: Parada[];
 
  @OneToMany( () => Viagem , viagem => viagem.rota)
  @JoinColumn({ name: 'viagens' }) 
  viagens: Viagem[];
}