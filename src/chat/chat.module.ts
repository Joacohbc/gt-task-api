import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { AIService, GeminiProvider } from '../ai/ai.service';

@Module({
    imports: [ConfigModule],
    controllers: [ChatController],
    providers: [AIService, GeminiProvider],
    exports: [AIService],
})
export class ChatModule { }
