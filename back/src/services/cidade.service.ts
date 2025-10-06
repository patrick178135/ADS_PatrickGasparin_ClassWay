import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCidadeDto } from 'src/dto/create-cidade.dto';
import { UpdateCidadeDto } from 'src/dto/update-cidade.dto';
import { Cidade } from 'src/entities/cidade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CidadeService {
    constructor(
        @InjectRepository(Cidade)
        private readonly cidadeRepository: Repository<Cidade>,
    ) { }

    async create(createCidadeDto: CreateCidadeDto) {
        try {
            const dadosCidade = {
                nome: createCidadeDto.nome,
                UF: createCidadeDto.UF,
            };

            const novaCidade = this.cidadeRepository.create(dadosCidade);
            await this.cidadeRepository.save(dadosCidade);

            return (novaCidade);
        } catch (error) {

            throw error;
        }
    }
    async findAll() {
        const cidade = await this.cidadeRepository.find({
            order: {
                ID_cidade: 'desc',
            },
        });

        return cidade;
    }

    async findOne(ID_cidade: number) {
        const cidade = await this.cidadeRepository.findOneBy({
            ID_cidade,
        });

        if (!cidade) {
            throw new NotFoundException('Cidade não encontrado');
        }

        return cidade;
    }

    async update(ID_cidade: number, updateCidadeDto: UpdateCidadeDto) {
        const dadosCidade = {
            nome: updateCidadeDto.nome,
            UF: updateCidadeDto.UF,
        };

        const cidade = await this.cidadeRepository.preload({
            ID_cidade,
            ...dadosCidade,
        });

        if (!cidade) {
            throw new NotFoundException('Cidade não encontrada.');
        }

        return this.cidadeRepository.save(cidade);
    }

    async remove(id: number) {
        const cidade = await this.cidadeRepository.findOneBy({ ID_cidade: id });
        if (!cidade) {
          throw new Error("Cidade não encontrada");
        }
        return this.cidadeRepository.remove(cidade);
    }
}