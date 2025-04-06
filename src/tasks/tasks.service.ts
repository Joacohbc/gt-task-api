import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindDetails, TaskFull, TaskWithRelations } from './types';
import { RemoveAutoDates, RemoveFields, RemoveId } from 'src/common/decorators/remove-fields.decorator';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<TaskFull[]> {
        return this.prisma.task.findMany();
    }

    async findOne(id: string, details: FindDetails): Promise<TaskWithRelations> {
        const { includeComments, includeSubtasks, includeTags, includeBoard, includeParentTask } = details;
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                comments: includeComments,
                subtasks: includeSubtasks,
                tags: includeTags,
                board: includeBoard,
                parentTask: includeParentTask,
            }
        });

        if (!task) {
            throw new Error(`TaskFull with ID ${id} not found`);
        }

        const taskWithRelations: TaskWithRelations = {
            task,
            subtaskCount: includeSubtasks ? task.subtasks.length : undefined,
            commentCount: includeComments ? task.comments.length : undefined,
            tagCount: includeTags ? task.tags.length : undefined,
        };

        return taskWithRelations;
    }

    async findByBoard(boardId: string): Promise<TaskFull[]> {
        return this.prisma.task.findMany({
            where: { boardId },
        });
    }

    @RemoveId({ processInputs: true, processOutput: false })
    @RemoveAutoDates({ processInputs: true })
    async create(task: TaskFull, tagIds?: string[]): Promise<TaskFull> {
        return this.prisma.task.create({
            data: {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                boardId: task.boardId,
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
    async update(id: string, task: TaskFull): Promise<TaskFull> {
        try {
            const { ...taskData } = task;

            return await this.prisma.task.update({
                where: { id },
                data: {
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    boardId: taskData.boardId,
                    parentId: taskData.parentId,
                    subtasks: {
                        set: taskData.subtasks?.map(subtask => ({ id: subtask.id })) || []
                    },
                    comments: {
                        set: taskData.comments?.map(comment => ({ id: comment.id })) || []
                    },
                    tags: {
                        set: taskData.tags?.map(tag => ({ id: tag.id })) || []
                    }
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
