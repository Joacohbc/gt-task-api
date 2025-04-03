// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { ConfigService } from '@nestjs/config'; // Opcional: para mejor manejo de config

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor(
        private readonly configService: ConfigService,
    ) {
        const databaseUrl = configService.get<string>('TURSO_DATABASE_URL');
        const authToken = configService.get<string>('TURSO_AUTH_TOKEN');

        if (!databaseUrl || !authToken) {
            throw new Error(
                'DATABASE_URL and TURSO_AUTH_TOKEN must be set in environment variables',
            );
        }

        const libsql = createClient({
            url: databaseUrl,
            authToken: authToken,
        });

        const adapter = new PrismaLibSQL(libsql);

        // 3. Llamar al constructor de PrismaClient con el adaptador
        super({ adapter });
    }

    async onModuleInit() {
        try {
            await this.$queryRaw`SELECT 1`;
            console.log('Database connection successful!');
        } catch (error) {
            console.error('Failed to connect to the database:', error);
        }
    }

    async onModuleDestroy() {
        // Prisma Client tampoco necesita un disconnect explícito con el adaptador libSQL
        // que se maneja automáticamente al cerrar el proceso.
        // No llames a this.$disconnect() como lo harías normalmente sin adaptador.
        console.log('Prisma Adapter resources will be released on process exit.');
    }

    // Puedes añadir métodos helper aquí si quieres, por ejemplo, para limpieza en tests
    // async cleanDatabase() { ... }
}