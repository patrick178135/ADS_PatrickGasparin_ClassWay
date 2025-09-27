import { Module } from '@nestjs/common';
import { PerfilController } from '../controllers/perfil.controller';
import { PerfilService } from '../services/perfil.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from '../entities/perfil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil])],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}