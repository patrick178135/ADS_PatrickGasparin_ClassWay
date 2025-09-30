import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PerfilService } from '../services/perfil.service';
import { CreatePerfilDto } from 'src/dto/create-perfil.dto';
import { UpdatePerfilDto } from 'src/dto/update-perfil.dto';
  
@Controller('perfil')
export class PerfilController {
    constructor(private readonly perfilService: PerfilService) {}
    
    @Post()
    create(@Body() createPerfilDto: CreatePerfilDto) {
        return this.perfilService.create(createPerfilDto);
    }

    @Get()
    findAll() {
      return this.perfilService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.perfilService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePerfilDto: UpdatePerfilDto) {
      return this.perfilService.update(+id, updatePerfilDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.perfilService.remove(+id);
    }
}