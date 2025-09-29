import { Module } from '@nestjs/common';
import { UsuarioController } from '../controllers/usuario.controller';
import { UsuarioService } from '../services/usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}