import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from '@prisma/client';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    async create(@Body() comment: Comment): Promise<Comment> {
        return this.commentsService.create(comment);
    }

    @Get()
    async findAll(@Query('taskId') taskId?: string): Promise<Comment[]> {
        if (taskId) {
            return this.commentsService.findByTask(taskId);
        }
        return this.commentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Comment> {
        return this.commentsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() comment: Comment): Promise<Comment> {
        return this.commentsService.update(id, comment);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.commentsService.remove(id);
    }
}
