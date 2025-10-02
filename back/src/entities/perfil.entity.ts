import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity()
export class Perfil {
  @PrimaryGeneratedColumn()
  ID_perfil: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @OneToMany( () => Usuario , usuario => usuario.perfil) 
  @JoinColumn({ name: 'usuarios' })
  usuarios: Usuario[];
}