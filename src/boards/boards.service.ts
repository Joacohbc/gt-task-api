import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RemoveId, RemoveAutoDates } from 'src/common/decorators/remove-fields.decorator';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {}

    async findAll(with_tasks : boolean): Promise<Board[]> {
        return this.prisma.board.findMany({
            include: { tasks: Boolean(with_tasks) }
        });
    }

    async findOne(id: string): Promise<Board> {
        const board = await this.prisma.board.findUnique({
            where: { id },
            include: { tasks: true }
        });
        
        if (!board) {
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        
        return board;
    }

    @RemoveId({ processInputs: true, processOutput: false })
    @RemoveAutoDates({ processInputs: true })
    async create(board: Board): Promise<Board> {
        const {...boardData } = board;
        
        return this.prisma.board.create({
            data: {
                ...boardData,
            }
        });
    }

    @RemoveAutoDates({ processInputs: true })
    async update(id: string, board: Board): Promise<Board> {
        try {
            const { ...boardData } = board;
            
            return await this.prisma.board.update({
                where: { id },
                data: {
                    ...boardData,
                    updatedAt: new Date(),
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Board with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.prisma.board.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Board with ID ${id} not found`);
            }
            throw error;
        }
    }
}
