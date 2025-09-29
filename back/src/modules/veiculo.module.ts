import { Module } from '@nestjs/common';
import { VeiculoController } from '../controllers/veiculo.controller';
import { VeiculoService } from '../services/veiculo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veiculo } from '../entities/veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo])],
  controllers: [VeiculoController],
  providers: [VeiculoService],
})
export class VeiculoModule {}