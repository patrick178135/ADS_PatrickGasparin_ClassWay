import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto } from 'src/dto/create-usuario.dto';
import { UpdateUsuarioDto } from 'src/dto/update-usuario.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
  
// @UseGuards(AuthTokenGuard) // bloqueia as todas as rotas (necessário TOKEN)
@Controller('usuario')
export class UsuarioController {
constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuarioService.create(createUsuarioDto);
    }

    @Get('')
    findAll(@Req() req: Request) {
        return this.usuarioService.findAll();
    }

    @Get('admin')
    findAllAdmin(@Req() req: Request) {
        return this.usuarioService.findAllAdmin();
    }

    @Get('motorista')
    findAllMotorista(@Req() req: Request) {
        return this.usuarioService.findAllMotorista();
    }
    
    @Get('aluno')
    findAllAluno(@Req() req: Request) {
        return this.usuarioService.findAllAluno();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
    }
}