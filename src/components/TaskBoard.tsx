"use client";
import { useEffect, useState } from "react";
import { fetchTasks } from "@/lib/tasks-service";
import type { Task, TaskStatus } from "@/lib/types";
import Column from "./TaskColumn";
import Filters from "./Filters";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filteredTask, setFilteredTask] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e) => setError(e.message));
  }, []);

  const handleCreate = (task: Task) => {
    setTasks((prev) => (prev ? [task, ...prev] : [task]));
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
  };

  const handleMove = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev ? prev.map((t) => (t.id === id ? { ...t, status } : t)) : prev
    );
  };

  if (error) return <div>Error: {error}</div>;
  if (!tasks) return <div>Loading...</div>;

  const visibleTasks =
    filteredTask.length > 0 ||
    (filteredTask.length === 0 &&
      (tasks.length === 0 || filteredTask !== tasks))
      ? filteredTask
      : tasks;

  const tagOptions = Array.from(new Set(tasks.flatMap((t) => t.tags)))
    .filter((tag): tag is string => Boolean(tag))
    .map((tag) => ({ value: tag, label: tag }));

  return (
    <div>
      <div className="flex justify-end">
        <Filters tasks={tasks} onResult={setFilteredTask} />
      </div>

      <div className="flex justify-center pt-10 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl">
          <Column
            title="Scheduled"
            tasks={visibleTasks.filter((t) => t.status === "scheduled")}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onMove={handleMove}
            tagOptions={tagOptions}
          />
          <Column
            title="In Progress"
            tasks={visibleTasks.filter((t) => t.status === "in-progress")}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onMove={handleMove}
            tagOptions={tagOptions}
          />
          <Column
            title="Done"
            tasks={visibleTasks.filter((t) => t.status === "done")}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onMove={handleMove}
            tagOptions={tagOptions}
          />
        </div>
      </div>
    </div>
  );
}
