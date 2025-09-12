import type { Task, TaskStatus } from './types';
import { loadTasks, saveTasks } from './storage';

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'> & { createdAt?: string };
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>> & { createdAt?: string };

export const TasksRepo = {
  list(): Task[] {
    const all = loadTasks();
    return all.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  find(id: string): Task | null {
    return loadTasks().find(t => t.id === id) ?? null;
  },

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: uid(),
      createdAt: input.createdAt ?? now,
      title: input.title,
      description: input.description,
      status: input.status,
      assignee: input.assignee,
      tags: input.tags ?? [],
      priority: input.priority,
    };
    const all = loadTasks();
    all.push(task);
    saveTasks(all);
    return task;
  },

  update(id: string, patch: UpdateTaskInput): Task {
    const all = loadTasks();
    const i = all.findIndex(t => t.id === id);
    if (i === -1) throw new Error('Task not found');
    all[i] = { ...all[i], ...patch };
    saveTasks(all);
    return all[i];
  },

  remove(id: string): void {
    const next = loadTasks().filter(t => t.id !== id);
    saveTasks(next);
  },

  move(id: string, nextStatus: TaskStatus): Task {
    return this.update(id, { status: nextStatus });
  },

  reset(): void {
    saveTasks([]);
  },
};
