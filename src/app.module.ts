import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'; // Importante para leer .env
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // Carga variables de .env
      isGlobal: true, // Hace ConfigModule global
    }),
    PrismaModule, // Importar nuestro módulo de Prisma
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}