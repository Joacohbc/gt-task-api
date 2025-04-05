import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RemoveId, RemoveAutoDates } from 'src/common/decorators/remove-fields.decorator';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Tag[]> {
        return this.prisma.tag.findMany();
    }

    async findOne(id: string): Promise<Tag> {
        const tag = await this.prisma.tag.findUnique({
            where: { id }
        });
        
        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }
        
        return tag;
    }

    async findByTask(taskId: string): Promise<Tag[]> {
        return this.prisma.tag.findMany({
            where: { 
                tasks: {
                    some: { 
                        id: taskId 
                    }
                }
            }
        });
    }

    @RemoveId({ processInputs: true })
    @RemoveAutoDates({ processInputs: true })
    async create(tag: Tag): Promise<Tag> {
        return this.prisma.tag.create({
            data: tag
        });
    }
    
    @RemoveId({ processInputs: true })
    @RemoveAutoDates({ processInputs: true })
    async createMany(tags: Tag[]): Promise<Tag[]> {
        return this.prisma.tag.createManyAndReturn({
            data: tags
        });
    }

    @RemoveAutoDates({ processInputs: true })
    async update(id: string, tag: Tag): Promise<Tag> {
        try {
            const { ...tagData } = tag;
            
            return await this.prisma.tag.update({
                where: { id },
                data: {
                    ...tagData,
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Tag with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.prisma.tag.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Tag with ID ${id} not found`);
            }
            throw error;
        }
    }
}
