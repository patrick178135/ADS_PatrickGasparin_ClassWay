import { Controller } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
  
@Controller('usuario')
export class UsuarioController {
constructor(private readonly usuarioService: UsuarioService) {}

}