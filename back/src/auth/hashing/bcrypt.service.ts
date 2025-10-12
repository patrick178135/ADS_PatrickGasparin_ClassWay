import { HashingService } from './hashing.service';
import * as bcrypt from 'bcryptjs';

export class BcryptService extends HashingService {
  async hash(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(senha, salt); // gera um hash
  }

  async compare(senha: string, senhaHash: string): Promise<boolean> {
    return bcrypt.compare(senha, senhaHash); // true === logado
  }
}