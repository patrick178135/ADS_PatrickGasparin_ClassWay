import { Module } from '@nestjs/common';
import { RotaController } from '../controllers/rota.controller';
import { RotaService } from '../services/rota.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rota } from '../entities/rota.entity';
import { Parada } from 'src/entities/parada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rota, Parada])],
  controllers: [RotaController],
  providers: [RotaService],
})
export class RotaModule {}