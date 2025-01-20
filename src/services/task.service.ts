export type TaskDTO = {
	id:number;
  title: string;
  color: string;
  completed?: boolean;
};

export class TaskService {
  private tasks: TaskDTO[] = []; // Example in-memory store

  public async getAll(): Promise<TaskDTO[]> {
    return this.tasks;
  }

  public async createTask(taskData: TaskDTO): Promise<TaskDTO> {
    const newTask: TaskDTO = {
      ...taskData,
      completed: taskData.completed ?? false,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  public async updateTask(id: number, updates: Partial<TaskDTO>): Promise<TaskDTO> {
    const task = this.tasks[id]; // naive approach using index for example
    if (!task) {
      throw new Error('Task not found');
    }
    this.tasks[id] = { ...task, ...updates };
    return this.tasks[id];
  }

  public async deleteTask(id: number): Promise<void> {
    const task = this.tasks[id];
    if (!task) {
      throw new Error('Task not found');
    }
    this.tasks.splice(id, 1);
  }
}
