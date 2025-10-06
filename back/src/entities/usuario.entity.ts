import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, IntegerType, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from "./perfil.entity";
import { Cidade } from "./cidade.entity";
import { Viagem } from "./viagem.entity";
import { Validacao } from "./validacao.entiy";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_usuario: number;

  @Column({ length: 255 })
  @IsNotEmpty()
  nome: string;

  @Column({ type: 'varchar', length: 11 })
  @IsNotEmpty()
  CPF: string;  
  
  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  senha: string;

  @Column()
  @IsNotEmpty()
  ativo: boolean;

  @ManyToOne(() => Perfil, perfil => perfil.ID_perfil)
  @JoinColumn({ name: 'perfil_usuario' })
  @Column()
  @IsNotEmpty()
  perfil_usuario: number;

  @ManyToOne(() => Cidade, cidade => cidade.ID_cidade)
  @JoinColumn({ name: 'cidade' })
  @Column()
  @IsNotEmpty()
  cidade: number;

  @ManyToMany(() => Viagem, (vaigem:Viagem) => vaigem.alunos)
  viagens: Viagem[];

  @OneToMany( () => Viagem , viagem => viagem.admin)
  @JoinColumn({ name: 'admins' }) 
  admins: Usuario[];

  @OneToMany( () => Viagem , viagem => viagem.motorista)
  @JoinColumn({ name: 'motoristas' }) 
  motoristas: Usuario[];

  @OneToMany( () => Validacao , validacao => validacao.aluno)
  @JoinColumn({ name: 'validacoes' }) 
  validacoes: Validacao[];

}