import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVeiculoDto } from 'src/dto/create-veiculo.dto';
import { UpdateVeiculoDto } from 'src/dto/update-veiculo.dto';
import { Veiculo } from 'src/entities/veiculo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VeiculoService {

    constructor(
        @InjectRepository(Veiculo)
        private readonly veiculoRepository: Repository<Veiculo>,
    ) { }

    async create(createVeiculoDto: CreateVeiculoDto) {
        try {
            const dadosVeiculo = {
                montadora: createVeiculoDto.montadora,
                modelo: createVeiculoDto.modelo,
                placa: createVeiculoDto.placa,
                capacidade: createVeiculoDto.capacidade,
                ativo: createVeiculoDto.ativo,
            };

            const novoVeiculo = this.veiculoRepository.create(dadosVeiculo);
            await this.veiculoRepository.save(dadosVeiculo);

            return (novoVeiculo);
        } catch (error) {

            throw error;
        }
    }

    async findAll() {
        const veiculo = await this.veiculoRepository.find({
            order: {
                ID_veiculo: 'desc',
            },
        });

        return veiculo;
    }

    async findOne(ID_veiculo: number) {
        const veiculo = await this.veiculoRepository.findOneBy({
            ID_veiculo,
        });

        if (!veiculo) {
            throw new NotFoundException('Veículo não encontrado');
        }

        return veiculo;
    }

    async update(ID_veiculo: number, updateVeiculoDto: UpdateVeiculoDto) {
        const dadosVeiculo = {
            montadora: updateVeiculoDto.montadora,
            modelo: updateVeiculoDto.modelo,
            placa: updateVeiculoDto.placa,
            capacidade: updateVeiculoDto.capacidade,
            ativo: updateVeiculoDto.ativo,
        };

        const veiculo = await this.veiculoRepository.preload({
            ID_veiculo,
            ...dadosVeiculo,
        });

        if (!veiculo) {
            throw new NotFoundException('Veículo não encontrado.');
        }

        return this.veiculoRepository.save(veiculo);
    }

    async remove(id: number) {
        const veiculo = await this.veiculoRepository.findOneBy({ ID_veiculo: id });
        if (!veiculo) {
          throw new Error("Veículo não encontrado");
        }
        return this.veiculoRepository.remove(veiculo);
    }
}