"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  status: string;
  priority: string;
};

const priorityColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

const statusColors: Record<string, string> = {
  todo: "#6b7280",
  "in-progress": "#3b82f6",
  done: "#22c55e",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);

    const url = params.toString() ? `/api/tasks?${params.toString()}` : "/api/tasks";
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  // CREATE TASK
  const addTask = async () => {
    if (!title.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) return;

    setTitle("");
    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id: number) => {
    const confirmed = confirm("Delete this task?");
    if (!confirmed) return;

    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    fetchTasks();
  };

  // UPDATE STATUS
  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) return;

    fetchTasks();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: 32,
        }}
      >
        <h1
          style={{
            margin: "0 0 24px 0",
            color: "#1e293b",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          Task Manager
        </h1>

        {/* FILTERS */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            padding: 16,
            backgroundColor: "#f1f5f9",
            borderRadius: 8,
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={() => {
              setStatusFilter("");
              setPriorityFilter("");
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#64748b",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* CREATE TASK */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            gap: 12,
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Enter task title..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              fontSize: 15,
              outline: "none",
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: "12px 24px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tasks.length === 0 && (
            <li
              style={{
                textAlign: "center",
                padding: 40,
                color: "#94a3b8",
                fontSize: 15,
              }}
            >
              No tasks found. Create one above!
            </li>
          )}
          {tasks.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                border: "1px solid #e2e8f0",
                marginBottom: 12,
                borderRadius: 8,
                backgroundColor: "#ffffff",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 500,
                    color: "#1e293b",
                    fontSize: 16,
                    marginBottom: 6,
                  }}
                >
                  {t.title}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: priorityColors[t.priority] || "#64748b",
                      backgroundColor: `${priorityColors[t.priority]}15` || "#f1f5f9",
                      padding: "4px 10px",
                      borderRadius: 4,
                      textTransform: "capitalize",
                    }}
                  >
                    {t.priority}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: statusColors[t.status] || "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    ● {t.status.replace("-", " ")}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {/* STATUS */}
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#334155",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* DELETE */}
                <button
                  onClick={() => deleteTask(t.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "1px solid #fecaca",
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}