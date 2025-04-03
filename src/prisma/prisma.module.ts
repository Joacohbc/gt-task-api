// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config'; // Importar si usas ConfigService

@Global() // Hace el servicio disponible globalmente sin necesidad de importar PrismaModule
@Module({
    imports: [ConfigModule], // Importar ConfigModule si usas ConfigService en PrismaService
    providers: [PrismaService],
    exports: [PrismaService], // Exportar para que otros módulos puedan inyectarlo
})
export class PrismaModule {}