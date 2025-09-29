import { Module } from '@nestjs/common';
import { RotaController } from '../controllers/rota.controller';
import { RotaService } from '../services/rota.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rota } from '../entities/rota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rota])],
  controllers: [RotaController],
  providers: [RotaService],
})
export class RotaModule {}