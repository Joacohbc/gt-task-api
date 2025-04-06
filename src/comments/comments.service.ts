import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RemoveAutoDates, RemoveId } from 'src/common/decorators/remove-fields.decorator';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Comment[]> {
        return this.prisma.comment.findMany();
    }

    async findOne(id: string): Promise<Comment> {
        const comment = await this.prisma.comment.findUnique({
            where: { id }
        });
        
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }
        
        return comment;
    }

    async findByTask(taskId: string): Promise<Comment[]> {
        return this.prisma.comment.findMany({
            where: { taskId }
        });
    }

    @RemoveId({ processInputs: true, processOutput: false })
    @RemoveAutoDates({ processInputs: true })
    async create(comment: Comment): Promise<Comment> {
        const {...commentData } = comment;
        
        return this.prisma.comment.create({
            data: {
                ...commentData,
            }
        });
    }

    @RemoveAutoDates({ processInputs: true })
    async update(id: string, comment: Comment): Promise<Comment> {
        try {
            const { ...commentData } = comment;
            
            return await this.prisma.comment.update({
                where: { id },
                data: {
                    ...commentData,
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Comment with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.prisma.comment.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Comment with ID ${id} not found`);
            }
            throw error;
        }
    }
}
