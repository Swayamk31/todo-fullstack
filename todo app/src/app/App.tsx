import { SetStateAction, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "@/app/components/TaskCard";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const API_URL = "http://localhost:5000";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  // ✅ READ (GET)
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ CREATE (POST)
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;

    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTaskText }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([newTask, ...tasks]);
        setNewTaskText("");
      });
  };

  // ✅ TOGGLE COMPLETE (PUT)
  const handleToggleComplete = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((t) => (t.id === id ? updatedTask : t))
        );
      });
  };

  // ✅ DELETE
  const handleDeleteTask = (id: number) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  // ✅ EDIT (PUT)
  const handleEditTask = (id: number, newText: string) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newText }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((t) => (t.id === id ? updatedTask : t))
        );
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-center text-3xl font-semibold text-gray-800">
            My To-Do App
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Add To-Do */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter a new task"
              value={newTaskText}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewTaskText(e.target.value)}
              onKeyDown={(e: { key: string; }) => {
                if (e.key === "Enter") handleAddTask();
              }}
              className="flex-1 text-base"
            />
            <Button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400 text-lg">
                <p className="mb-2">📝</p>
                <p>No tasks yet. Add your first task!</p>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                text={task.title}
                completed={task.completed}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
