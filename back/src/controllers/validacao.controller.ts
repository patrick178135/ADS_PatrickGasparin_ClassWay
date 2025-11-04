import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateValidacaoDto } from 'src/dto/create-validacao.dto';
import { UpdateValidacaoDto } from 'src/dto/update-validacao.dto';
import { ValidacaoService } from 'src/services/validacao.service';
  
@Controller('validacao')
export class ValidacaoController {
constructor(private readonly validacaoService: ValidacaoService) {}

    @Post()
    create(@Body() createValidacaoDto: CreateValidacaoDto) {
        return this.validacaoService.create(createValidacaoDto);
    }

    @Post('lote')
    createMany(@Body() validacoes: CreateValidacaoDto[]) {
      return this.validacaoService.createMany(validacoes);
    }
    
    @Get()
    findAll() {
    return this.validacaoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.validacaoService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateValidacaoDto: UpdateValidacaoDto) {
    return this.validacaoService.update(+id, updateValidacaoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.validacaoService.remove(+id);
    }

}