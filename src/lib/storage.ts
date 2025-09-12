import type { Task } from './types';
import { seedTasks } from './seed';

const KEY = 'kanban.tasks.v1';

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadTasks(): Task[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as Task[];
    return Array.isArray(data) ? data : [];
  } catch {
    localStorage.removeItem(KEY);
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

export function seedIfEmpty() {
  if (!isBrowser()) return;

  const alreadySeeded = localStorage.getItem("seeded");

  if (!alreadySeeded) {
    if (loadTasks().length === 0) {
      saveTasks(seedTasks);
    }
    localStorage.setItem("seeded", "true");
  }
}

