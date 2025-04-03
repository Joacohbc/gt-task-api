import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FindDetails, TaskWithRelations } from './types';

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
            throw new NotFoundException(`Task with ID ${id} not found`);
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

    async create(task: Task): Promise<Task> {
        const {...taskData } = task;
        
        return this.prisma.task.create({
            data: {
                id: uuidv4(),
                ...taskData,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
    }

    async update(id: string, task: Task): Promise<Task> {
        try {
            const { ...taskData } = task;
            
            return await this.prisma.task.update({
                where: { id },
                data: {
                    ...taskData,
                    updatedAt: new Date(),
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Task with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.prisma.task.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Task with ID ${id} not found`);
            }
            throw error;
        }
    }
}
