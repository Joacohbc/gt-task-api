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
import { TagsService } from './tags.service';
import { Tag } from '@prisma/client';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    async create(@Body() tag: Tag): Promise<Tag> {
        return this.tagsService.create(tag);
    }

    @Get()
    async findAll(@Query('taskId') taskId?: string): Promise<Tag[]> {
        if (taskId) {
            return this.tagsService.findByTask(taskId);
        }
        return this.tagsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Tag> {
        return this.tagsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() tag: Tag): Promise<Tag> {
        return this.tagsService.update(id, tag);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.tagsService.remove(id);
    }
}
