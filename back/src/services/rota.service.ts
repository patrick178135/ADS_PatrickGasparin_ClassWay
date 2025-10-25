import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRotaDto } from 'src/dto/create-rota.dto';
import { UpdateRotaDto } from 'src/dto/update-rota.dto';
import { Parada } from 'src/entities/parada.entity';
import { Rota } from 'src/entities/rota.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RotaService {

    constructor(
        @InjectRepository(Rota)
        private readonly rotaRepository: Repository<Rota>,

        @InjectRepository(Parada)
        private readonly paradaRepository: Repository<Parada>,
    ) { }

    async create(createRotaDto: CreateRotaDto) {
        try {
          const { nome, partida, destino, paradas } = createRotaDto;
      
          // Buscar todas as paradas com base nos IDs enviados
          const paradasEntities = await this.paradaRepository.findBy({
            ID_parada: In(paradas),
          });
      
          // Garantir que todas as paradas existam
          if (paradasEntities.length !== paradas.length) {
            throw new Error("Uma ou mais paradas informadas não existem");
          }
      
          // Criar a nova rota já com as entidades
          const novaRota = this.rotaRepository.create({
            nome,
            partida,
            destino,
            paradas: paradasEntities, // aqui vai a lista de entidades
          });
      
          await this.rotaRepository.save(novaRota);
      
          return novaRota;
        } catch (error) {
          console.error("Erro ao criar rota:", error);
          throw error;
        }
    }

    async findAll() {
        const rota = await this.rotaRepository.find({
            order: {
                ID_rota: 'asc',
            },
        });

        return rota;
    }

    async findOne(ID_rota: number) {
        const rota = await this.rotaRepository.findOneBy({
            ID_rota,
        });

        if (!rota) {
            throw new NotFoundException('Rota não encontrado');
        }

        return rota;
    }

    async update(ID_rota: number, updateRotaDto: UpdateRotaDto) {
        const { nome, partida, destino, paradas } = updateRotaDto;
      
        let paradasEntities: Parada[] | undefined;

            if (paradas && paradas.length > 0) {
            paradasEntities = await this.paradaRepository.findBy({
                ID_parada: In(paradas),
            });

            if (!paradasEntities || paradasEntities.length !== paradas.length) {
                throw new NotFoundException("Uma ou mais paradas informadas não existem");
                }
            }
      
        const rota = await this.rotaRepository.preload({
          ID_rota,
          nome,
          partida,
          destino,
          ...(paradasEntities ? { paradas: paradasEntities } : {}),
        });
      
        if (!rota) {
          throw new NotFoundException('Rota não encontrada.');
        }
      
        return this.rotaRepository.save(rota);
      }

    async remove(id: number) {
        const rota = await this.rotaRepository.findOneBy({ ID_rota: id });
        if (!rota) {
          throw new Error("Rota não encontrada");
        }
        return this.rotaRepository.remove(rota);
    }
}