import { createTask } from "@/lib/tasks-service";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useToast } from "./Toast";

type TaskModelProps = {
  visible: boolean;
  onClose: () => void;
  status: string;
  onCreate: (task: Task) => void;
  tagOptions: { value: string; label: string }[];
};

export default function TaskModel({
  visible,
  onClose,
  status,
  onCreate,
  tagOptions,
}: TaskModelProps) {
  if (!visible) return null;

  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState<any[]>([]);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const { showToast } = useToast();

  const createNewTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    let statusData: TaskStatus;

    if (status === "Done") {
      statusData = "done";
    } else if (status === "In Progress") {
      statusData = "in-progress";
    } else {
      statusData = "scheduled";
    }

    try {
      const newTask = await createTask({
        title,
        description,
        status: statusData,
        assignee,
        priority: priority as TaskPriority,
        tags: tags.map((t) => t.value),
      });
      onCreate(newTask);
    } catch (err) {
      console.error(err);
      showToast("Failed to create task. Please try again.", "error");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-0">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md h-[90vh] sm:h-[80vh] md:h-auto overflow-y-auto  p-4 sm:p-6 ">
        <div className="relative bg-white rounded-lg ">
          <div className="flex items-center justify-between border-b pb-2 sm:pb-3 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 ">
              Create New Task
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
              onClick={onClose}
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
          <form className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="Type product name"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Status
                </label>
                <input
                  value={status}
                  name="status"
                  id="status"
                  className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder={status}
                  disabled
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Assignee
                </label>
                <select
                  id="category"
                  onChange={(e) => setAssignee(e.target.value)}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                  value={assignee}
                >
                  <option value="">Select category</option>
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
                <CreatableSelect
                  isMulti
                  name="colors"
                  options={tagOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(newValue) => setTags(newValue as any[])}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Priority
                </label>
                <select
                  id="category"
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                  value={priority}
                >
                  <option value="">Select category</option>
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
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Write product description here"
                ></textarea>
              </div>
            </div>
            <button
              onClick={createNewTask}
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
