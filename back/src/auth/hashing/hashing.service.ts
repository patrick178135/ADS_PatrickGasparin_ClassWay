export abstract class HashingService {
    abstract hash(senha: string): Promise<string>;
    abstract compare(senha: string, senhaHash: string): Promise<boolean>;
  }