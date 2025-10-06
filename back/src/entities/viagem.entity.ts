import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Veiculo } from "./veiculo.entity";
import { Validacao } from "./validacao.entiy";
import { Rota } from "./rota.entity";

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

  @ManyToOne(() => Usuario, Usuario => Usuario.ID_usuario)
  @JoinColumn({ name: 'admin' })
  @Column()
  @IsNotEmpty()
  admin: number;

  @ManyToOne(() => Usuario, Usuario => Usuario.ID_usuario)
  @JoinColumn({ name: 'motorista' })
  @Column()
  @IsNotEmpty()
  motorista: number;

  @ManyToOne(() => Veiculo, veiculo => veiculo.ID_veiculo)
  @JoinColumn({ name: 'veiculo' })
  @Column()
  @IsNotEmpty()
  veiculo: number;

  @ManyToOne(() => Rota, rota => rota.ID_rota)
  @JoinColumn({ name: 'rota' })
  @Column()
  @IsNotEmpty()
  rota: number;
  
  @ManyToMany(() => Usuario, (usuario:Usuario) => usuario.viagens)
  @JoinTable()
  alunos: Usuario[];

  @OneToMany( () => Validacao , validacao => validacao.viagem)
  @JoinColumn({ name: 'validacoes' }) 
  validacoes: Validacao[];
}