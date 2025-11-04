import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, IntegerType, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Parada } from "./parada.entity";
import { Viagem } from "./viagem.entity";

@Entity()
export class Validacao {
  @PrimaryGeneratedColumn()
  ID_validacao: number;

  @Column()
  @IsNotEmpty()
  tipo_evento: string;

  @Column()
  @IsNotEmpty()
  data_hora: Date;  

  @ManyToOne(() => Usuario, usuario => usuario.ID_usuario)
  @JoinColumn({ name: 'aluno' })
  @IsNotEmpty()
  aluno: number;

  @ManyToOne(() => Parada, parada => parada.ID_parada)
  @JoinColumn({ name: 'parada' })
  @IsNotEmpty()
  parada: number;

  @ManyToOne(() => Viagem, viagem => viagem.ID_viagem)
  @JoinColumn({ name: 'viagem' })
  @IsNotEmpty()
  viagem: number;

}