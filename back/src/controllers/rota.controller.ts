import { Controller } from '@nestjs/common';
import { RotaService } from '../services/rota.service';
  
@Controller('rota')
export class RotaController {
constructor(private readonly rotaService: RotaService) {}

}