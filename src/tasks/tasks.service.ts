import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FindDetails, TaskWithRelations } from './types';
import { RemoveAutoDates, RemoveFields, RemoveId } from 'src/common/decorators/remove-fields.decorator';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Task[]> {
        return this.prisma.task.findMany();
    }

    async findOne(id: string, details: FindDetails): Promise<TaskWithRelations> {
        const { includeComments, includeSubtasks, includeTags, includeBoard } = details;
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                comments: includeComments,
                subtasks: includeSubtasks,
                tags: includeTags,
                board: includeBoard,
            }
        });

        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }

        const taskWithRelations: TaskWithRelations = {
            task,
            board: includeBoard ? task.board : undefined,
            tags: includeTags ? task.tags : undefined,
            comments: includeComments ? task.comments : undefined,
            subtasks: includeSubtasks ? task.subtasks : undefined,
            subtaskCount: includeSubtasks ? task.subtasks.length : undefined,
            commentCount: includeComments ? task.comments.length : undefined,
            tagCount: includeTags ? task.tags.length : undefined,
        };
        
        return taskWithRelations;
    }

    async findByBoard(boardId: string): Promise<Task[]> {
        return this.prisma.task.findMany({
            where: { boardId },
            include: { comments: true, subtasks: true }
        });
    }

    @RemoveId({ processInputs: true, processOutput: false })
    @RemoveAutoDates({ processInputs: true })
    async create(task: Task, tagIds?: string[]): Promise<Task> {
        return this.prisma.task.create({
            data: {
                ...task,
                tags: {
                    connect: tagIds?.map(tagId => ({ id: tagId })) || []
                }
            },
            include: {
                tags: true
            }
        });
    }

    @RemoveAutoDates({ processInputs: true })
    async update(id: string, task: Task): Promise<Task> {
        try {
            const { ...taskData } = task;
            
            return await this.prisma.task.update({
                where: { id },
                data: {
                    ...taskData,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.prisma.task.delete({
                where: { id },
            });
        } catch (error) {
            throw error;
        }
    }
}
