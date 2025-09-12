import type { Task, TaskStatus } from './types';
import { TasksRepo, CreateTaskInput, UpdateTaskInput } from './tasks-repo';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const SHOULD_FAIL_RATE = 0; //can motidy to test

function maybeFail() {
  if (Math.random() < SHOULD_FAIL_RATE) {
    throw new Error('Mock network error');
  }
}

export async function fetchTasks(): Promise<Task[]> {
  await delay(200);
  maybeFail();
  return TasksRepo.list();
}

export async function fetchTask(id: string): Promise<Task | null> {
  await delay(150);
  maybeFail();
  return TasksRepo.find(id);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  await delay(200);
  maybeFail();
  return TasksRepo.create(input);
}

export async function updateTask(id: string, patch: UpdateTaskInput): Promise<Task> {
  await delay(200);
  maybeFail();
  return TasksRepo.update(id, patch);
}

export async function deleteTask(id: string): Promise<void> {
  await delay(150);
  maybeFail();
  return TasksRepo.remove(id);
}

export async function moveTask(id: string, status: TaskStatus): Promise<Task> {
  await delay(120);
  maybeFail();
  return TasksRepo.move(id, status);
}
