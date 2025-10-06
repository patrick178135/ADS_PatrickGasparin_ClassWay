import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CidadeService } from '../services/cidade.service';
import { CreateCidadeDto } from 'src/dto/create-cidade.dto';
import { UpdateCidadeDto } from 'src/dto/update-cidade.dto';
  
@Controller('cidade')
export class CidadeController {
constructor(private readonly cidadeService: CidadeService) {}

    @Post()
        create(@Body() createCidadeDto: CreateCidadeDto) {
            return this.cidadeService.create(createCidadeDto);
        }
    
    @Get()
    findAll() {
    return this.cidadeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.cidadeService.findOne(+id);
    }
    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCidadeDto: UpdateCidadeDto) {
    return this.cidadeService.update(+id, updateCidadeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.cidadeService.remove(+id);
    }
}