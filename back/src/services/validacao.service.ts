import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { equal } from 'assert';
import { CreateValidacaoDto } from 'src/dto/create-validacao.dto';
import { UpdateValidacaoDto } from 'src/dto/update-validacao.dto';
import { Validacao } from 'src/entities/validacao.entiy';
import { Repository } from 'typeorm';

@Injectable()
export class ValidacaoService {

    constructor(
        @InjectRepository(Validacao)
        private readonly validacaoRepository: Repository<Validacao>,
    ) { }

    async create(createValidacaoDto: CreateValidacaoDto) {
        try {
            const dadosValidacao = {
                tipo_evento: createValidacaoDto.tipo_evento,
                data_hora: createValidacaoDto.data,
                aluno: createValidacaoDto.aluno,
                parada: createValidacaoDto.parada,
                viagem: createValidacaoDto.viagem,
            };

            const novaValidacao = this.validacaoRepository.create(dadosValidacao);
            await this.validacaoRepository.save(dadosValidacao);

            return (novaValidacao);
        } catch (error) {

            throw error;
        }
    }

    async createMany(validacoesDtos: CreateValidacaoDto[]) {
        try {
            const agora = new Date();

            const validacoes = validacoesDtos.map(dto =>
                this.validacaoRepository.create({
                    tipo_evento: dto.tipo_evento,
                    data_hora: agora,
                    aluno: dto.aluno,
                    parada: dto.parada,
                    viagem: dto.viagem,
                }),
            );

            return await this.validacaoRepository.save(validacoes);
        } catch (error) {
            console.error('Erro ao salvar validações em lote:', error);
            throw error;
        }
    }

    async findAllByViagem(ID_Viagem: number) {
        const validacoes = await this.validacaoRepository.find({
            where: {
                viagem: ID_Viagem,
            },
            order: {
                data_hora: 'asc',
            },
            relations: ['aluno', 'parada'],
        });

        return validacoes;
    }

    async findAllByUsuario(ID_usuario: number) {
        const validacoes = await this.validacaoRepository.find({
            where: {
                aluno: ID_usuario,
            },
            order: {
                data_hora: 'asc',
            },
            relations: ['viagem', 'parada'],
        });

        return validacoes;
    }

    async findAll() {
        const validacao = await this.validacaoRepository.find({
            order: {
                ID_validacao: 'asc',
            },
        });

        return validacao;
    }

    async findOne(ID_validacao: number) {
        const validacao = await this.validacaoRepository.findOneBy({
            ID_validacao,
        });

        if (!validacao) {
            throw new NotFoundException('Validação não encontrado');
        }

        return validacao;
    }

    async update(ID_validacao: number, updateValidacaoDto: UpdateValidacaoDto) {
        const dadosValidacao = {
            tipo_evento: updateValidacaoDto.tipo_evento,
            data_hora: updateValidacaoDto.data,
            aluno: updateValidacaoDto.aluno,
            parada: updateValidacaoDto.parada,
            viagem: updateValidacaoDto.viagem,
        };

        const validacao = await this.validacaoRepository.preload({
            ID_validacao,
            ...dadosValidacao,
        });

        if (!validacao) {
            throw new NotFoundException('Validação não encontrada.');
        }

        return this.validacaoRepository.save(validacao);
    }

    async remove(id: number) {
        const validacao = await this.validacaoRepository.findOneBy({ ID_validacao: id });
        if (!validacao) {
            throw new Error("Validação não encontrada");
        }
        return this.validacaoRepository.remove(validacao);
    }
}