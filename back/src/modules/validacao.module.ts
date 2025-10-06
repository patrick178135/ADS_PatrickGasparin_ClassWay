import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidacaoController } from 'src/controllers/validacao.controller';
import { Validacao } from 'src/entities/validacao.entiy';
import { ValidacaoService } from 'src/services/validacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Validacao])],
  controllers: [ValidacaoController],
  providers: [ValidacaoService],
})
export class ValidacaoModule {}