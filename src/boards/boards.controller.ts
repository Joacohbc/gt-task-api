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
import { BoardsService } from './boards.service';
import { Board } from '@prisma/client';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    async create(@Body() board: Board): Promise<Board> {
        return this.boardsService.create(board);
    }

    @Get()
    async findAll(@Query('with_tasks') withTasks : boolean): Promise<Board[]> {
        return this.boardsService.findAll(withTasks);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('with_tasks') withTasks : boolean): Promise<Board> {
        return this.boardsService.findOne(id, withTasks);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() board: Board): Promise<Board> {
        return this.boardsService.update(id, board);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.boardsService.remove(id);
    }
}
