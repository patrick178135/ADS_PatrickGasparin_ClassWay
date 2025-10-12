import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Usuario } from 'src/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly hashingService: HashingService, 
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {

        const usuario = await this.usuarioRepository.findOneBy({
            email: loginDto.email,
        });

        if (!usuario){
            throw new UnauthorizedException("Usuário não encontrado")
        }

        const senhaIsValid =  await this.hashingService.compare(
            loginDto.senha,
            usuario.senhaHash,
        );

        if (!senhaIsValid){
            throw new UnauthorizedException("Senha inválida")
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: usuario.ID_usuario,
                email: usuario.email,
                perfil: usuario.perfil_usuario,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret:this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
            }
        )

        return{
            accessToken
        }
    }

}