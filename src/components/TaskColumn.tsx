import type { Task, TaskStatus } from "@/lib/types";
import { deleteTask, moveTask } from "@/lib/tasks-service";
import { useState } from "react";
import TaskModel from "./TaskModel";
import Link from "next/link";
import { useToast } from "./Toast";

type ColumnProps = {
  title: string;
  tasks: Task[];
  onCreate: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  tagOptions: { value: string; label: string }[];
};

export default function TaskColumn({
  title,
  tasks,
  onCreate,
  onDelete,
  onMove,
  tagOptions,
}: ColumnProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [showMoveEditor, setMoveEditor] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const { showToast } = useToast();

  const options = [
    { label: "Move to Scheduled", value: "scheduled" },
    { label: "Move to In Progress", value: "in-progress" },
    { label: "Move to Done", value: "done" },
  ];

  const handleDeleteTask = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        onDelete(id);
      } catch (err) {
        console.error(err);
        showToast("Failed to delete task. Please try again.", "error");
      }
    }
  };

  const changeStatus = async (
    id: string,
    status: "scheduled" | "in-progress" | "done",
    e: React.FormEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await moveTask(id, status);
      onMove(id, status);
    } catch (err) {
      console.error(err);
      showToast("Failed to move task. Please try again.", "error");
    }
  };

  return (
    <div className="w-full sm:w-full lg:max-w-md p-2 sm:p-3 lg:p-4 bg-white border border-gray-200 rounded-lg shadow-sm ">
      <h5 className="flex justify-between mb-3 text-sm sm:text-base lg:text-lg font-semibold text-gray-900 ">
        {title}
        <button onClick={() => setShowEditor(true)} className="cursor-pointer">
          <svg
            className="w-6 h-6 text-gray-800 "
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
              d="M5 12h14m-7 7V5"
            />
          </svg>
          <span className="sr-only">Create</span>
        </button>
      </h5>
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center pt-8">
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 8H4m8 3.5v5M9.5 14h5M4 6v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"
            />
          </svg>
          <h4 className="text-lg font-semibold text-gray-700 ">No Tasks</h4>
          <span className="text-sm text-gray-500 ">
            Get started by creating a new task.
          </span>
        </div>
      )}
      <ul className="my-4 space-y-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sm:hidden text-gray-600 hover:text-gray-900 text-xs border rounded px-2 py-1"
        >
          {collapsed ? "Expand" : "Fold"}
        </button>
        {!collapsed && (
          <>
            {tasks.map((item: Task, id: number) => (
              <li key={id}>
                <div className="p-2 sm:p-3 lg:p-4 text-sm sm:text-base lg:text-lg font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow ">
                  <div className="flex items-center justify-between">
                    <Link href={`/tasks/${item.id}`}>
                      <span className="flex-1 whitespace-nowrap truncate cursor-pointer text-sm sm:text-base">
                        {item.title}
                      </span>
                    </Link>
                    <div>
                      <button
                        type="button"
                        className="text-white bg-white border-amber-300 border-2 font-light rounded-lg text-sm p-1.5 sm:p-2 lg:p-2.5 text-center inline-flex items-center cursor-pointer mr-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMoveEditor((prev) =>
                            prev === item.id ? null : item.id
                          );
                        }}
                      >
                        <svg
                          className="w-4 h-4 text-gray-800 "
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
                            strokeWidth="2"
                            d="M6 12h.01m6 0h.01m5.99 0h.01"
                          />
                        </svg>

                        <span className="sr-only">Move</span>
                      </button>
                      {showMoveEditor === item.id && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                          <div className="bg-white  rounded-lg shadow-lg p-6 w-96">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold mb-2 text-gray-900 ">
                                {title}
                              </h3>
                              <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMoveEditor(null);
                                }}
                                data-modal-toggle="crud-modal"
                              >
                                <svg
                                  className="w-3 h-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                                <span className="sr-only">Close modal</span>
                              </button>
                            </div>
                            <p className="mb-4 text-sm text-gray-700 ">
                              What do you want to do with this task?
                            </p>
                            <div className="flex gap-2 justify-end">
                              {options.map((opt, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    changeStatus(
                                      item.id,
                                      opt.value as TaskStatus,
                                      e
                                    );
                                    setMoveEditor(null);
                                  }}
                                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        className="text-white bg-red-300 font-light rounded-lg text-sm p-1.5 sm:p-2 lg:p-2.5 text-center inline-flex items-center cursor-pointer"
                        onClick={(e) => handleDeleteTask(item.id, e)}
                      >
                        <svg
                          className="w-4 h-4 text-gray-800 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-row">
                    {item.assignee && (
                      <div className="mt-2 flex items-center pr-3">
                        <div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 rounded-full ">
                          <span className="font-medium text-gray-600 ">
                            {item.assignee.slice(0, 1)}
                          </span>
                        </div>
                      </div>
                    )}

                    {item.priority && (
                      <div className="mt-2 flex items-center">
                        <span className="text-gray-900 border mt-2 border-gray-800 font-medium rounded-lg text-xs px-2.5 py-0.5 text-center me-2 mb-2 ">
                          {item.priority}
                        </span>
                      </div>
                    )}
                  </div>
                  {item.tags && (
                    <div className="mt-2 flex flex-row">
                      {item.tags.map((tag, id) => {
                        return (
                          <span
                            key={id}
                            className="bg-gray-800 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm "
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </>
        )}
      </ul>

      <TaskModel
        visible={showEditor}
        onClose={() => setShowEditor(false)}
        status={title}
        onCreate={onCreate}
        tagOptions={tagOptions}
      />
    </div>
  );
}
