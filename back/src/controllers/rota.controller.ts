import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RotaService } from '../services/rota.service';
import { CreateRotaDto } from 'src/dto/create-rota.dto';
import { UpdateRotaDto } from 'src/dto/update-rota.dto';
  
@Controller('rota')
export class RotaController {
constructor(private readonly rotaService: RotaService) {}

    @Post()
    create(@Body() createRotaDto: CreateRotaDto) {
        return this.rotaService.create(createRotaDto);
    }

    @Get()
    findAll() {
    return this.rotaService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.rotaService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRotaDto: UpdateRotaDto) {
    return this.rotaService.update(+id, updateRotaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.rotaService.remove(+id);
    }
}