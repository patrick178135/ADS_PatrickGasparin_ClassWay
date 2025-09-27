import { Controller } from '@nestjs/common';
import { PerfilService } from '../services/perfil.service';
  
@Controller('perfil')
export class PerfilController {
constructor(private readonly perfilService: PerfilService) {}

}