import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    findAll(): Task[] {
        return this.tasks;
    }

    findOne(id: string): Task {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    findByBoard(boardId: string): Task[] {
        return this.tasks.filter(task => task.boardId === boardId);
    }

    create(newTask: Task): Task {
        this.tasks.push({
            id: uuidv4(),
            ...newTask,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: [],
            subtasks: [],
        });
        return newTask;
    }

    update(id: string, updatedTask: Task): Task {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        const task = this.tasks[taskIndex];
        this.tasks[taskIndex] = {
            ...task,
            ...updatedTask,
            updatedAt: new Date(),
        };
        return updatedTask;
    }

    remove(id: string): void {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        this.tasks.splice(taskIndex, 1);
    }
}
