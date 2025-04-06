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
import { TasksService } from './tasks.service';
import { Task } from '@prisma/client';
import { TaskWithRelations } from './types';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    async create(@Body() data: TaskWithRelations): Promise<Task> {
        return this.tasksService.create(data.task, data?.tags?.map(tag => tag.id) || []);
    }

    @Get()
    async findAll(@Query('boardId') boardId?: string): Promise<Task[]> {
        if (boardId) {
            return this.tasksService.findByBoard(boardId);
        }
        return this.tasksService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query() details: any): Promise<TaskWithRelations> {
        const includeComments = details.includeComments === 'true';
        const includeSubtasks = details.includeSubtasks === 'true';
        const includeTags = details.includeTags === 'true';
        const includeBoard = details.includeBoard === 'true';
        const includeSubtaskCount = details.includeSubtaskCount === 'true';
        const includeCommentCount = details.includeCommentCount === 'true';
        const includeTagCount = details.includeTagCount === 'true';

        return this.tasksService.findOne(id, {
            includeComments,
            includeSubtasks,
            includeTags,
            includeBoard,
            includeSubtaskCount,
            includeCommentCount,
            includeTagCount
        });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() task: Task): Promise<Task> {
        return this.tasksService.update(id, task);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.tasksService.remove(id);
    }
}
