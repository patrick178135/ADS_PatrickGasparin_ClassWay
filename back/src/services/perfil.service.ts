import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePerfilDto } from 'src/dto/create-perfil.dto';
import { UpdatePerfilDto } from 'src/dto/update-perfil.dto';
import { Perfil } from 'src/entities/perfil.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
  ) { }

  async create(createPerfilDto: CreatePerfilDto) {
    try {
      const dadosPerfil = {
        nome: createPerfilDto.nome,
      };

      const novoPerfil = this.perfilRepository.create(dadosPerfil);
      await this.perfilRepository.save(dadosPerfil);

      return (novoPerfil);
    } catch (error) {

      throw error;
    }
  }

  async findAll() {
    const perfil = await this.perfilRepository.find({
      order: {
        ID_perfil: 'desc',
      },
    });

    return perfil;
  }

  async findOne(ID_perfil: number) {
    const perfil = await this.perfilRepository.findOneBy({
      ID_perfil,
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return perfil;
  }

  async update(ID_perfil: number, updatePerfilDto: UpdatePerfilDto) {
    const dadosPerfil = {
      nome: updatePerfilDto?.nome,
    };

    const perfil = await this.perfilRepository.preload({
      ID_perfil,
      ...dadosPerfil,
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return this.perfilRepository.save(perfil);
  }

  async remove(ID_perfil: number) {
    const perfil = await this.findOne(ID_perfil);
    return this.perfilRepository.remove(perfil);
  }
}