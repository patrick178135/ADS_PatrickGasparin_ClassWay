import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ length: 7 })
  @IsNotEmpty()
  placa: string;

  @Column()
  @IsNotEmpty()
  capacidade: number;

  @Column()
  ativo: boolean;
}