import { Module } from '@nestjs/common';
import { CidadeController } from '../controllers/cidade.controller';
import { CidadeService } from '../services/cidade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidade } from '../entities/cidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cidade])],
  controllers: [CidadeController],
  providers: [CidadeService],
})
export class CidadeModule {}