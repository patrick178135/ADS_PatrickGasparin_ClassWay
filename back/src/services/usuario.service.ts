import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { CreateUsuarioDto } from 'src/dto/create-usuario.dto';
import { UpdateUsuarioDto } from 'src/dto/update-usuario.dto';
import { Usuario } from 'src/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly hashingService: HashingService,
    ) { }

    async create(createUsuarioDto: CreateUsuarioDto) {
        try {

            const senhaHash = await this.hashingService.hash(createUsuarioDto.senha)

            const dadosUsuario = {
                nome: createUsuarioDto.nome,
                CPF: createUsuarioDto.CPF,
                email: createUsuarioDto.email,
                senhaHash,
                ativo: createUsuarioDto.ativo,
                perfil_usuario: createUsuarioDto.perfil_usuario,
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
                ID_usuario: 'asc',
            },
        });

        return usuario;
    }

    async findAllAluno() {
        const usuarioAluno = await this.usuarioRepository.find({
            where: {
                perfil_usuario: 3,
            },
            order: {
                ID_usuario: 'asc',
            },
        });

        return usuarioAluno;
    }

    async findOne(ID_usuario: number) {
        const usuario = await this.usuarioRepository.findOneBy({
            ID_usuario,
        });

        if (!usuario) {
            throw new NotFoundException('Usuario não encontrado');
        }

        return usuario;
    }

    async update(ID_usuario: number, updateUsuarioDto: UpdateUsuarioDto) {

        let senhaHash: string | undefined;

        // Se vier uma nova senha, gera o hash
        if (updateUsuarioDto?.senha) {
            senhaHash = await this.hashingService.hash(updateUsuarioDto.senha);
        }

        const dadosUsuario = {
            nome: updateUsuarioDto.nome,
            CPF: updateUsuarioDto.CPF,
            email: updateUsuarioDto.email,
            senhaHash: senhaHash,
            ativo: updateUsuarioDto.ativo,
            perfil_usuario: updateUsuarioDto.perfil_usuario,
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