import { Body, Controller, Post } from '@nestjs/common';
import { CidadeService } from '../services/cidade.service';
import { CreateCidadeDto } from 'src/dto/create-cidade.dto';
  
@Controller('cidade')
export class CidadeController {
constructor(private readonly cidadeService: CidadeService) {}

    @Post()
        create(@Body() createCidadeDto: CreateCidadeDto) {
            return this.cidadeService.create(createCidadeDto);
        }
}