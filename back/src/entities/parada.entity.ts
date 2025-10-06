import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cidade } from "./cidade.entity";
import { Rota } from "./rota.entity";
import { Validacao } from "./validacao.entiy";

@Entity()
export class Parada {
  @PrimaryGeneratedColumn()
  ID_parada: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @ManyToOne(() => Cidade, cidade => cidade.ID_cidade)
  @JoinColumn({ name: 'destino' })
  @Column()
  @IsNotEmpty()
  cidade : number;

  @ManyToMany(() => Rota, (rota:Rota) => rota.paradas)
  rotas: Rota[];
  
  @OneToMany( () => Validacao , validacao => validacao.parada)
  @JoinColumn({ name: 'validacoes' }) 
  validacoes: Validacao[];
}