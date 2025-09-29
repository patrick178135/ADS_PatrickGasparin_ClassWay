import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_usuario: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column()
  CPF: number;
  
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  @Column({ type: 'varchar', length: 255 })
  ativo: string;

}