import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateViagemDto } from 'src/dto/create-viagem.dto';
import { UpdateViagemDto } from 'src/dto/update-viagem.dto';
import { Usuario } from 'src/entities/usuario.entity';
import { Viagem } from 'src/entities/viagem.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ViagemService {

    constructor(
        @InjectRepository(Viagem)
        private readonly viagemRepository: Repository<Viagem>,

        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) { }

    async create(createViagemDto: CreateViagemDto) {
        try {
          const { nome, data, admin, motorista, rota, veiculo, alunos } = createViagemDto;
      
          // Buscar todos os usuários com base nos IDs enviados
          const alunosEntities = await this.usuarioRepository.findBy({
            ID_usuario: In(alunos),
          });
      
          // Garantir que todas os usuários existam
          if (alunosEntities.length !== alunos.length) {
            throw new Error("Um ou mais usuários informados não existem");
          }
      
          // Criar a nova viagem já com as entidades
          const novaViagem = this.viagemRepository.create({
            nome, 
            data, 
            admin, 
            motorista, 
            rota, 
            veiculo, 
            alunos : alunosEntities, // aqui vai a lista de entidades
          });
      
          await this.viagemRepository.save(novaViagem);
      
          return novaViagem;
        } catch (error) {
          console.error("Erro ao criar viagem:", error);
          throw error;
        }
    }

    async findAll() {
        const viagem = await this.viagemRepository.find({
            order: {
                ID_viagem: 'asc',
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
        const { nome, data, admin, motorista, rota, veiculo, alunos } = updateViagemDto;
      
        let alunosEntities: Usuario[] | undefined;

            if (alunos && alunos.length > 0) {
            alunosEntities = await this.usuarioRepository.findBy({
                ID_usuario: In(alunos),
            });

            if (!alunosEntities || alunosEntities.length !== alunos.length) {
                throw new NotFoundException("Um ou mais alunos informados não existem");
                }
            }
      
        const viagem = await this.viagemRepository.preload({
            ID_viagem,
            nome, 
            data, 
            admin, 
            motorista, 
            rota, 
            veiculo, 
          ...(alunosEntities ? { alunos: alunosEntities } : {}),
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