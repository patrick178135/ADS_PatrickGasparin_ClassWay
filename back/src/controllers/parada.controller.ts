import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ParadaService } from '../services/parada.service';
import { CreateParadaDto } from 'src/dto/create-parada.dto';
import { UpdateParadaDto } from 'src/dto/update-partida.dto';
  
@Controller('parada')
export class ParadaController {
constructor(private readonly paradaService: ParadaService) {}

    @Post()
    create(@Body() createParadaDto: CreateParadaDto) {
        return this.paradaService.create(createParadaDto);
    }

    @Get()
    findAll() {
    return this.paradaService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.paradaService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradaService.update(+id, updateParadaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.paradaService.remove(+id);
    }
}