import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app/app.module'; 

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // antes de todos os testes neste arquivo
  beforeAll(async () => {
    // cria uma instância completa da sua aplicação em memória.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // importa o módulo principal que tem tudo
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // depois de todos os testes para limpar
  afterAll(async () => {
    await app.close();
  });

  // Requisição GET para a rota raiz ('/')
  it('/ (GET)', () => {

    return request(app.getHttpServer())
      .get('/') 
      .expect(200) 
      .expect('Hello World!'); 
  });
});
