import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
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
    async findAll(@Param('with_tasks') with_tasks): Promise<Board[]> {
        return this.boardsService.findAll(with_tasks);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Board> {
        return this.boardsService.findOne(id);
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
