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
import { Task } from '../types';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() task: Task): Task {
        return this.tasksService.create(task);
    }

    @Get()
    findAll(@Query('boardId') boardId?: string): Task[] {
        if (boardId) {
            return this.tasksService.findByBoard(boardId);
        }
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Task {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() task: Task): Task {
        return this.tasksService.update(id, task);
    }

    @Delete(':id')
    remove(@Param('id') id: string): void {
        this.tasksService.remove(id);
    }
}
