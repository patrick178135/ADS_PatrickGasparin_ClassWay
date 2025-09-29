import { Controller } from '@nestjs/common';
import { CidadeService } from '../services/cidade.service';
  
@Controller('veiculo')
export class CidadeController {
constructor(private readonly cidadeService: CidadeService) {}

}