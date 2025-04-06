import { Tag, Task, Comment, Board } from '@prisma/client';

export type FindDetails = {
    includeComments: boolean;
    includeSubtasks: boolean;
    includeTags: boolean;
    includeBoard: boolean;
    includeSubtaskCount: boolean;
    includeCommentCount: boolean;
    includeTagCount: boolean;
    includeParentTask: boolean;
}

export type TaskWithRelations = {
    task: Task;
    board?: Board;
    tags?: Tag[];
    comments?: Comment[];
    subtasks?: Task[];
    subtaskCount?: number;
    commentCount?: number;
    tagCount?: number;
};

export type TaskFull = Task & {
    tags?: Tag[];
    comments?: Comment[];
    subtasks?: Task[];
    board?: Board;
};