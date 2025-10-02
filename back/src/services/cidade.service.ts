import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCidadeDto } from 'src/dto/create-cidade.dto';
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
}