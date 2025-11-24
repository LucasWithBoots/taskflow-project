import axios from "axios";
import { Task } from "../types";

const API_BASE = "http://192.168.1.12:8080/api";

export async function loadTasks() {
  try {
    const response = await axios.get<Task[]>(`${API_BASE}/tasks`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log("Erro ao carregar tarefas", err);
  }
}

export async function createTask({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  if (!title) return;
  try {
    const now = new Date();
    const dueDate = new Date(now.getTime() + 60 * 60 * 1000); // +1h
    const reminderAt = new Date(now.getTime() + 5 * 60 * 1000); // +5min

    await axios.post(`${API_BASE}/tasks`, {
      title,
      description,
      userId: "user1",
      dueDate: dueDate.toISOString().slice(0, 19),
      reminderAt: reminderAt.toISOString().slice(0, 19),
      completed: false,
    });
  } catch (err) {
    console.log("Erro ao criar tarefa", err);
  }
}

export async function completeTask(taskId: number) {
  try {
    await axios.post(`${API_BASE}/tasks/${taskId}/complete`);
  } catch (err) {
    console.log("Erro ao completar tarefa", err);
  }
}

export async function deleteTask(taskId: number) {
  try {
    await axios.delete(`${API_BASE}/tasks/${taskId}`);
  } catch (err) {
    console.log("Erro ao deletar tarefa", err);
  }
}
