import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateViagemDto } from 'src/dto/create-viagem.dto';
import { UpdateViagemDto } from 'src/dto/update-viagem.dto';
import { Viagem } from 'src/entities/viagem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViagemService {

    constructor(
        @InjectRepository(Viagem)
        private readonly viagemRepository: Repository<Viagem>,
    ) { }

    async create(createViagemDto: CreateViagemDto) {
        try {
            const dadosViagem = {
                nome: createViagemDto.nome,
                data: createViagemDto.data,
                admin: createViagemDto.admin,
                motorista: createViagemDto.motorista,
                rota: createViagemDto.rota,
                veiculo: createViagemDto.veiculo,
            };

            const novaViagem = this.viagemRepository.create(dadosViagem);
            await this.viagemRepository.save(dadosViagem);

            return (novaViagem);
        } catch (error) {

            throw error;
        }
    }

    async findAll() {
        const viagem = await this.viagemRepository.find({
            order: {
                ID_viagem: 'desc',
            },
        });

        return viagem;
    }

    async findOne(ID_viagem: number) {
        const viagem = await this.viagemRepository.findOneBy({
            ID_viagem,
        });

        if (!viagem) {
            throw new NotFoundException('Viagem não encontrado');
        }

        return viagem;
    }

    async update(ID_viagem: number, updateViagemDto: UpdateViagemDto) {
        const dadosViagem = {
            nome: updateViagemDto.nome,
            data: updateViagemDto.data,
            admin: updateViagemDto.admin,
            motorista: updateViagemDto.motorista,
            rota: updateViagemDto.rota,
            veiculo: updateViagemDto.veiculo,
        };

        const viagem = await this.viagemRepository.preload({
            ID_viagem,
            ...dadosViagem,
        });

        if (!viagem) {
            throw new NotFoundException('Viagem não encontrada.');
        }

        return this.viagemRepository.save(viagem);
    }

    async remove(id: number) {
        const viagem = await this.viagemRepository.findOneBy({ ID_viagem: id });
        if (!viagem) {
          throw new Error("Viagem não encontrada");
        }
        return this.viagemRepository.remove(viagem);
    }
}