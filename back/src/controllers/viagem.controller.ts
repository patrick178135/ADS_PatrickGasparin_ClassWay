import { Controller } from '@nestjs/common';
import { ViagemService } from '../services/viagem.service';
  
@Controller('viagem')
export class ViagemController {
constructor(private readonly viagemService: ViagemService) {}

}