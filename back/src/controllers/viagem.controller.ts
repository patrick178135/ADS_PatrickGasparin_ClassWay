import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ViagemService } from '../services/viagem.service';
import { CreateViagemDto } from 'src/dto/create-viagem.dto';
import { UpdateViagemDto } from 'src/dto/update-viagem.dto';
  
@Controller('viagem')
export class ViagemController {
constructor(private readonly viagemService: ViagemService) {}

    @Post()
    create(@Body() createViagemDto: CreateViagemDto) {
        return this.viagemService.create(createViagemDto);
    }

    @Get()
    findAll() {
    return this.viagemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.viagemService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateViagemDto: UpdateViagemDto) {
    return this.viagemService.update(+id, updateViagemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.viagemService.remove(+id);
    }
}