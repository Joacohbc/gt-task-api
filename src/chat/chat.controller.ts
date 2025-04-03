import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AIService, ChatMessage } from '../ai/ai.service';

@Controller('chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(private aiService: AIService) { }

    @Post()
    async chat(@Body() body: { messages: ChatMessage[] }) {
        try {
            this.logger.log(`Received messages: ${JSON.stringify(body.messages)}`);

            if (!body.messages || !Array.isArray(body.messages)) {
                throw new HttpException(
                    'Messages are required and must be an array',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const response = await this.aiService.generateChatResponse(body.messages);

            return { content: response };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error(`Error processing chat request: ${error.message}`, error.stack);
            throw new HttpException(
                'Failed to communicate with AI service',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
