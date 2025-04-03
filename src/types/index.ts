// TaskStatus
export enum TaskStatus {
    TODO = 'todo',
    REVIEW = 'review',
    ON_HOLD = 'on-hold',
    BLOCKED = 'blocked',
    IN_PROGRESS = 'in-progress',
    TESTING = 'testing',
    DONE = 'done',
    ACHIEVED = 'achieved',
}

export const ALL_TASK_STATUSES = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.BLOCKED,
    TaskStatus.ON_HOLD,
    TaskStatus.REVIEW,
    TaskStatus.TESTING,
    TaskStatus.DONE,
    TaskStatus.ACHIEVED,
];

// TaskPriority
export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export const ALL_TASK_PRIORITIES = [
    TaskPriority.LOW,
    TaskPriority.MEDIUM,
    TaskPriority.HIGH,
];

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    boardId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    dueDate?: Date;
    tags?: Tag[];
    comments?: Comment[];
    parentId?: string;
    parentTask?: Task;
    subtasks?: Task[];
}

export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    parentId?: string;
    replies?: Comment[];
}


export type Board = {
    id: string;
    title: string;
    tasks: Task[];
}

export type Message = {
    role: "user" | "assistant"
    content: string
}

// MessageType Enum
export enum MessageType {
    USER = "user",
    ASSISTANT = "assistant",
}