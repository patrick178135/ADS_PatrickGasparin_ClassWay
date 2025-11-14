import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateViagemDto } from 'src/dto/create-viagem.dto';
import { UpdateViagemDto } from 'src/dto/update-viagem.dto';
import { Usuario } from 'src/entities/usuario.entity';
import { Viagem } from 'src/entities/viagem.entity';
import { Equal, In, LessThan, MoreThan, Repository } from 'typeorm';

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

      const alunosEntities = await this.usuarioRepository.findBy({
        ID_usuario: In(alunos),
      });

      if (alunosEntities.length !== alunos.length) {
        throw new Error("Um ou mais usuários informados não existem");
      }

      const novaViagem = this.viagemRepository.create({
        nome,
        data,
        admin,
        motorista,
        rota,
        veiculo,
        alunos: alunosEntities, 
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
      relations: ['alunos'],
      order: {
        data: 'DESC',
      },
    });

    return viagem;
  }

  async findAllHistoricoAluno(idAluno: number) {
    const dataAtual = new Date();

    return this.viagemRepository.find({
      where: {
        data: LessThan(dataAtual), 
        alunos: { ID_usuario: Equal(idAluno) }, 
      },
      relations: ['alunos', 'rota', 'veiculo', 'admin', 'motorista'],
      order: {
        data: 'DESC', 
      },
    });
  }

  async findAllAgendaAluno(idAluno: number) {
    const dataAtual = new Date();

    return this.viagemRepository.find({
      where: {
        data: MoreThan(dataAtual), 
        alunos: { ID_usuario: Equal(idAluno) }, 
      },
      relations: ['alunos', 'rota', 'veiculo', 'admin', 'motorista'],
      order: {
        data: 'ASC', 
      },
    });
  }

  async findOne(ID_viagem: number) {
    const viagem = await this.viagemRepository.findOne({
        where: { ID_viagem },
        relations: ['alunos', 'rota', 'veiculo', 'admin', 'motorista'], 
    });

    if (!viagem) {
        throw new NotFoundException('Viagem não encontrado');
    }

    return viagem;
}

async update(ID_viagem: number, updateViagemDto: UpdateViagemDto) {
  const { nome, data, admin, motorista, rota, veiculo, alunos } = updateViagemDto;

  const alunosEntities = alunos && alunos.length > 0
    ? await this.usuarioRepository.findBy({ ID_usuario: In(alunos) })
    : [];

  const viagem = await this.viagemRepository.preload({
    ID_viagem,
    nome,
    data,
    admin,
    motorista,
    rota,
    veiculo,
    alunos: alunosEntities,
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

  async adicionarAluno(idViagem: number, idAluno: number) {
    const viagem = await this.viagemRepository.findOne({
      where: { ID_viagem: idViagem },
      relations: ['alunos'],
    });

    if (!viagem) {
      throw new NotFoundException('Viagem não encontrada.');
    }

    const aluno = await this.usuarioRepository.findOneBy({ ID_usuario: idAluno });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    if (viagem.alunos.some(a => a.ID_usuario === idAluno)) {
      return viagem; 
    }

    viagem.alunos.push(aluno);
    return this.viagemRepository.save(viagem);
  }

  async removerAluno(idViagem: number, idAluno: number) {
    const viagem = await this.viagemRepository.findOne({
      where: { ID_viagem: idViagem },
      relations: ['alunos'],
    });

    if (!viagem) {
      throw new NotFoundException('Viagem não encontrada.');
    }

    const alunosAntes = viagem.alunos.length;
    viagem.alunos = viagem.alunos.filter(aluno => aluno.ID_usuario !== idAluno);
    const alunosDepois = viagem.alunos.length;

    if (alunosAntes === alunosDepois) {
      throw new NotFoundException('Aluno não estava inscrito nesta viagem.');
    }

    return this.viagemRepository.save(viagem);
  }
}