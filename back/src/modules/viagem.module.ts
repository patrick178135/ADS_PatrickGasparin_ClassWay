import { Module } from '@nestjs/common';
import { ViagemController } from '../controllers/viagem.controller';
import { ViagemService } from '../services/viagem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viagem } from '../entities/viagem.entity';
import { Usuario } from 'src/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viagem, Usuario])],
  controllers: [ViagemController],
  providers: [ViagemService],
})
export class ViagemModule {}