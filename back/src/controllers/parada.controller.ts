import { Controller } from '@nestjs/common';
import { ParadaService } from '../services/parada.service';
  
@Controller('parada')
export class ParadaController {
constructor(private readonly paradaService: ParadaService) {}

}