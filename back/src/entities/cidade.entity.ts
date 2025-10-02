import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity()
export class Cidade {
  @PrimaryGeneratedColumn()
  ID_cidade: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @Column({ length: 2 })
  @IsNotEmpty()
  UF: string;

  @OneToMany( () => Usuario , usuario => usuario.cidade) 
  @JoinColumn({ name: 'usuarios' })
  usuarios: Usuario[];
}