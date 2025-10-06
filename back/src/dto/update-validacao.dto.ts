import { PartialType } from '@nestjs/mapped-types';
import { CreateValidacaoDto } from './create-validacao.dto';

export class UpdateValidacaoDto extends PartialType(CreateValidacaoDto) {}