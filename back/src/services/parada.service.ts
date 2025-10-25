import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParadaDto } from 'src/dto/create-parada.dto';
import { UpdateParadaDto } from 'src/dto/update-partida.dto';
import { Parada } from 'src/entities/parada.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParadaService {
    constructor(
        @InjectRepository(Parada)
        private readonly paradaRepository: Repository<Parada>,
    ) { }

    async create(createParadaDto: CreateParadaDto) {
        try {
            const dadosParada = {
                nome: createParadaDto.nome,
                cidade: createParadaDto.cidade,
            };

            const novaParada = this.paradaRepository.create(dadosParada);
            await this.paradaRepository.save(dadosParada);

            return (novaParada);
        } catch (error) {

            throw error;
        }
    }

    async findAll() {
        const parada = await this.paradaRepository.find({
            order: {
                ID_parada: 'asc',
            },
        });

        return parada;
    }

    async findOne(ID_parada: number) {
        const parada = await this.paradaRepository.findOneBy({
            ID_parada,
        });

        if (!parada) {
            throw new NotFoundException('Parada não encontrado');
        }

        return parada;
    }

    async update(ID_parada: number, updateParadaDto: UpdateParadaDto) {
        const dadosParada = {
            nome: updateParadaDto.nome,
            cidade: updateParadaDto.cidade,
        };

        const parada = await this.paradaRepository.preload({
            ID_parada,
            ...dadosParada,
        });

        if (!parada) {
            throw new NotFoundException('Parada não encontrada.');
        }

        return this.paradaRepository.save(parada);
    }

    async remove(id: number) {
        const parada = await this.paradaRepository.findOneBy({ ID_parada: id });
        if (!parada) {
          throw new Error("Parada não encontrada");
        }
        return this.paradaRepository.remove(parada);
    }
}