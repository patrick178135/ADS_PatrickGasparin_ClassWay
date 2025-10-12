import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PerfilModule } from 'src/modules/perfil.module';
import { VeiculoModule } from 'src/modules/veiculo.module';
import { CidadeModule } from 'src/modules/cidade.module';
import { UsuarioModule } from 'src/modules/usuario.module';
import { ViagemModule } from 'src/modules/viagem.module';
import { RotaModule } from 'src/modules/rota.module';
import { ParadaModule } from 'src/modules/parada.module';
import { ValidacaoModule } from 'src/modules/validacao.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: true, // Carrega entidades sem precisar especifica-las
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza com o BD.
    }),
    PerfilModule,
    VeiculoModule,
    CidadeModule,
    UsuarioModule,
    ViagemModule,
    RotaModule,
    ParadaModule,
    ValidacaoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
