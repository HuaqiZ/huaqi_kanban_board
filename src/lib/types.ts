export type TaskStatus = 'scheduled' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assignee?: string;
    tags?: string[];
    createdAt: string;
    priority?: TaskPriority;
}