"use client";

import { useState, useMemo, useEffect } from "react";
import type { Task } from "@/lib/types";

interface FiltersProps {
  tasks: Task[];
  onResult: (filtered: Task[]) => void;
}

export default function Filters({ tasks, onResult }: FiltersProps) {
  const [searchText, setSearchText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [tag, setTag] = useState("");

  const filteredTask = useMemo(() => {
    return tasks.filter((t) => {
      return (
        (searchText === "" ||
          t.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (t.description &&
            t.description.toLowerCase().includes(searchText.toLowerCase()))) &&
        (assignee === "" || t.assignee === assignee) &&
        (tag === "" || (t.tags && t.tags.includes(tag)))
      );
    });
  }, [tasks, searchText, assignee, tag]);

  useEffect(() => {
    onResult(filteredTask);
  }, [filteredTask, onResult]);

  const assignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter(Boolean))
  );

  const tags = Array.from(
    new Set(tasks.flatMap((t) => t.tags || []).filter(Boolean))
  );

  const handleClear = () => {
    setSearchText("");
    setAssignee("");
    setTag("");
  };

  return (
    <div className="flex flex-col sm:p-8 sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border px-2 py-1 rounded w-full sm:w-48"
      />

      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="border px-2 py-1 rounded w-full sm:w-auto"
      >
        <option value="">All Assignees</option>
        {assignees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border px-2 py-1 rounded w-full sm:w-auto"
      >
        <option value="">All Tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleClear}
        className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm w-full sm:w-auto"
      >
        Clear
      </button>
    </div>
  );
}
