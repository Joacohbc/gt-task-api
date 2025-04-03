const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    // Read seed data
    const boardsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'boards.json'), 'utf8'));
    const tagsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'tags.json'), 'utf8'));
    // const tasksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'tasks.json'), 'utf8'));
    const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'comments.json'), 'utf8'));

    // Create boards
    console.log('Creating boards...');
    for (const board of boardsData) {
        await prisma.board.create({
            data: {
                id: board.id,
                title: board.title,
                createdAt: new Date(board.createdAt),
                updatedAt: new Date(board.updatedAt)
            }
        });
    }

    // Create tags
    console.log('Creating tags...');
    for (const tag of tagsData) {
        await prisma.tag.create({
            data: {
                id: tag.id,
                name: tag.name,
                color: tag.color
            }
        });
    }

    // Create tasks (without connecting tags yet)
    console.log('Creating tasks...');
    for (const task of tasksData) {
        if (!task.parentId) {
            await prisma.task.create({
                data: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    boardId: task.boardId,
                    createdAt: new Date(task.createdAt),
                    updatedAt: new Date(task.updatedAt),
                    startDate: task.startDate ? new Date(task.startDate) : null,
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                    assignee: task.assignee
                }
            });
        }
    }

    // Create subtasks
    console.log('Creating subtasks...');
    for (const task of tasksData) {
        if (task.parentId) {
            await prisma.task.create({
                data: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    boardId: task.boardId,
                    parentId: task.parentId,
                    createdAt: new Date(task.createdAt),
                    updatedAt: new Date(task.updatedAt),
                    startDate: task.startDate ? new Date(task.startDate) : null,
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                    assignee: task.assignee
                }
            });
        }
    }

    // Connect tasks with tags
    console.log('Connecting tasks with tags...');
    for (const task of tasksData) {
        if (task.tags && task.tags.length > 0) {
            await prisma.task.update({
                where: { id: task.id },
                data: {
                    tags: {
                        connect: task.tags.map(tagId => ({ id: tagId }))
                    }
                }
            });
        }
    }

    // Create comments (without replies first)
    console.log('Creating comments...');
    for (const comment of commentsData) {
        if (!comment.parentId) {
            await prisma.comment.create({
                data: {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    taskId: comment.taskId,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: new Date(comment.updatedAt)
                }
            });
        }
    }

    // Create comment replies
    console.log('Creating comment replies...');
    for (const comment of commentsData) {
        if (comment.parentId) {
            await prisma.comment.create({
                data: {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    taskId: comment.taskId,
                    parentId: comment.parentId,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: new Date(comment.updatedAt)
                }
            });
        }
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
