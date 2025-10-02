import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from 'src/dto/create-usuario.dto';
import { UpdateUsuarioDto } from 'src/dto/update-usuario.dto';
import { Usuario } from 'src/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) { }

    async create(createUsuarioDto: CreateUsuarioDto) {
        try {
            const dadosUsuario = {
                nome: createUsuarioDto.nome,
                CPF: createUsuarioDto.CPF,
                email: createUsuarioDto.email,
                senha: createUsuarioDto.senha,
                ativo: createUsuarioDto.ativo,
                perfil: createUsuarioDto.perfil,
                cidade: createUsuarioDto.cidade,
            };

            const novoUsuario = this.usuarioRepository.create(dadosUsuario);
            await this.usuarioRepository.save(dadosUsuario);

            return (novoUsuario);
        } catch (error) {

            throw error;
        }
    }

    async findAll() {
        const usuario = await this.usuarioRepository.find({
            order: {
                ID_usuario: 'desc',
            },
        });

        return usuario;
    }

    async findOne(ID_usuario: number) {
        const usuario = await this.usuarioRepository.findOneBy({
            ID_usuario,
        });

        if (!usuario) {
            throw new NotFoundException('Usuario não encontrado');
        }

        return Usuario;
    }

    async update(ID_usuario: number, updateUsuarioDto: UpdateUsuarioDto) {
        const dadosUsuario = {
            nome: updateUsuarioDto?.nome,
            cpf: updateUsuarioDto.CPF,
            email: updateUsuarioDto.email,
            senha: updateUsuarioDto.senha,
            perfil: updateUsuarioDto.perfil,
            cidade: updateUsuarioDto.cidade,
        };

        const usuario = await this.usuarioRepository.preload({
            ID_usuario,
            ...dadosUsuario,
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return this.usuarioRepository.save(usuario);
    }

    async remove(id: number) {
        const usuario = await this.usuarioRepository.findOneBy({ ID_usuario: id });
        if (!usuario) {
          throw new Error("Usuário não encontrado");
        }
        return this.usuarioRepository.remove(usuario);
      }
}