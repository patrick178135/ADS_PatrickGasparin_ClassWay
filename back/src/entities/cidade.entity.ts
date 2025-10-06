import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Rota } from "./rota.entity";
import { Parada } from "./parada.entity";

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

  @OneToMany( () => Rota , rota => rota.partida) 
  @JoinColumn({ name: 'rota_partidas' })
  rota_partidas: Rota[];

  @OneToMany( () => Rota , rota => rota.destino) 
  @JoinColumn({ name: 'rota_destinos' })
  rota_destinos: Rota[];

  @OneToMany( () => Parada , parada => parada.cidade) 
  @JoinColumn({ name: 'paradas' })
  paradas: Parada[];
}
