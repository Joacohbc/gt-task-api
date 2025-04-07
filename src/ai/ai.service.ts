import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type ChatMessage = {
    role: string;
    content: string;
};

export interface AIProvider {
    generateChatResponse(messages: ChatMessage[]): Promise<string>;
}

@Injectable()
export class GeminiProvider implements AIProvider {
    private readonly genAI: GoogleGenerativeAI;
    private readonly logger = new Logger(GeminiProvider.name);
    private readonly MODEL = 'gemini-2.0-flash-thinking-exp-01-21';

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'NOT_FOUND';
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateChatResponse(messages: ChatMessage[]): Promise<string> {
        try {
            // Convert messages to Gemini format
            const formattedMessages = messages.map(message => ({
                role: message.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: message.content }],
            }));

            // Get the model and start a chat
            const model = this.genAI.getGenerativeModel({ model: this.MODEL });
            const chat = model.startChat({
                history: formattedMessages.slice(0, -1),
            });

            // Send the last message and get the response
            const result = await chat.sendMessage(
                formattedMessages[formattedMessages.length - 1].parts[0].text,
            );

            return result.response.text();
        } catch (error) {
            this.logger.error(`Error communicating with Gemini API: ${error.message}`, error.stack);
            throw error;
        }
    }
}

@Injectable()
export class AIService {
    private provider: AIProvider;

    constructor(private geminiProvider: GeminiProvider) {
        this.provider = geminiProvider;
    }

    setProvider(provider: AIProvider) {
        this.provider = provider;
    }

    async generateChatResponse(messages: ChatMessage[]): Promise<string> {
        return this.provider.generateChatResponse(messages);
    }
}
