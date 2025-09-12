"use client";
import { useEffect, useState } from "react";
import { fetchTask, updateTask } from "@/lib/tasks-service";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import CreatableSelect from "react-select/creatable";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Option = { value: string; label: string };

const options = [
  { value: "setup", label: "Set Up" },
  { value: "nextjs", label: "NextJs" },
  { value: "ux", label: "UX" },
  { value: "ui", label: "UI" },
  { value: "components", label: "Components" },
  { value: "dnd", label: "DND" },
  { value: "filters", label: "Filters" },
  { value: "crud", label: "CRUD" },
  { value: "form", label: "Form" },
  { value: "routing", label: "Routing" },
  { value: "responsive", label: "Responsive" },
];

export default function TaskPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const { id } = await params;
      const t = await fetchTask(id);
      setTask(t);
    })();
  }, [params]);

  if (!task) return <div>Loading...</div>;

  const handleChange = (key: keyof Task, value: any) => {
    setTask((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task?.title.trim()) {
      alert("Title is required!");
      return;
    }
    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        assignee: task.assignee,
        priority: task.priority as TaskPriority,
        tags: task.tags,
      });
      setTask(updated);
      router.push("/");
    } catch (err) {
      console.error(err);
      showToast("Failed to update task. Please try again.", "error");
    }
  };

  return (
    <section className="bg-white">
      <button
        type="button"
        onClick={() => {
          router.push("/");
        }}
        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-light sm:font-medium rounded-lg text-sm px-5 p-1.5 sm:p-2 lg:p-2.5 text-center me-2 mt-2 ml-2 sm:ml-10 sm:mt-10"
      >
        <svg
          className="w-6 h-6 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M5 12l4-4m-4 4 4 4"
          />
        </svg>
        <span className="sr-only">Back</span>
      </button>
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 ">
          Update product
        </h2>
        <form onSubmit={handleUpdate}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Title<span className="text-red-500">*</span>
              </label>
              <input
                value={task.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="border rounded p-2 w-full mb-4"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) =>
                  handleChange("status", e.target.value as TaskStatus)
                }
                className="border rounded p-2 w-full mb-4"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Assignee
              </label>
              <select
                value={task.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                className="border rounded p-2 w-full mb-4"
              >
                <option value="">Select assignee</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Cara">Cara</option>
                <option value="Dan">Dan</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Tags
              </label>
              <CreatableSelect<Option, true>
                isMulti
                options={options}
                value={
                  task.tags &&
                  task.tags.map((tag) => ({ value: tag, label: tag }))
                }
                onChange={(newValue) =>
                  handleChange(
                    "tags",
                    (newValue as Option[]).map((v) => v.value)
                  )
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) =>
                  handleChange("priority", e.target.value as TaskPriority)
                }
                className="border rounded p-2 w-full mb-4"
              >
                <option value="">Select Priority</option>
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 ">
                Description
              </label>
              <textarea
                value={task.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border rounded p-2 w-full mb-4"
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Update
          </button>
        </form>
      </div>
    </section>
  );
}
