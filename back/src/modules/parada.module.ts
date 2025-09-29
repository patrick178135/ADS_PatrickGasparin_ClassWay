import { Module } from '@nestjs/common';
import { ParadaController } from '../controllers/parada.controller';
import { ParadaService } from '../services/parada.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parada } from '../entities/parada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parada])],
  controllers: [ParadaController],
  providers: [ParadaService],
})
export class ParadaModule {}