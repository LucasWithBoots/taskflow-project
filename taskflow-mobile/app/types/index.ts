export interface Task {
  id: number;
  title: string;
  description?: string;
  userId: string;
  dueDate: string;     // ISO 8601, ex: "2025-11-30T18:00:00"
  reminderAt: string;  // ISO 8601
  completed: boolean;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  userId: string;
  dueDate: string;     // ISO 8601
  reminderAt: string;  // ISO 8601
  completed?: boolean; // se não enviar, o backend já considera false
}
