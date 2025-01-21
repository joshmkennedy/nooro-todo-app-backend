import { PrismaClient } from "@prisma/client";
import db from "../db";

export type TaskDTO = {
  id: number;
  title: string;
  color: string;
  completed?: boolean;
};

export type NewTaskInput = Omit<TaskDTO, "id">;
export type UpdateTaskInput = Partial<NewTaskInput>;

export class TaskService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  public async getAll(): Promise<TaskDTO[]> {
    const tasks: TaskDTO[] = await this.db.task
      .findMany({
        orderBy: {
          completed: "desc",
        },
      })
      .catch((e: Error) => {
        console.error(e);
        throw new Error("DB Error");
      });

    return tasks;
  }

  public async getTask(id: number): Promise<TaskDTO> {
    const task: TaskDTO | null = await this.db.task
      .findUnique({
        where: {
          id,
        },
      })
      .catch((e: Error) => {
        console.error(e);
        throw new Error("DB Error");
      });

    if (!task) {
      throw new Error("NO TASKS FOUND");
    }

    return task;
  }

  public async createTask(taskData: NewTaskInput): Promise<TaskDTO> {
    const data: NewTaskInput = {
      ...taskData,
      completed: taskData.completed ?? false,
    };

    const task: TaskDTO = await this.db.task
      .create({ data })
      .catch((e: Error) => {
        console.error(e);
        throw new Error("DB Error");
      });

    return task;
  }

  public async updateTask(id: number, data: UpdateTaskInput): Promise<TaskDTO> {
    const task: TaskDTO = await this.db.task
      .update({
        where: { id },
        data,
      })
      .catch((e: Error) => {
        if (e.toString() == "Record to update not found.") {
          throw new Error("NO TASKS FOUND"); // using same error message as above so we can use the same error handler later
        } else {
          console.error(e);
          throw new Error("DB Error");
        }
      });
    return task;
  }

  public async deleteTask(id: number): Promise<void> {
    await this.db.task.delete({ where: { id } }).catch((e: Error) => {
      if (e.toString() == "Record to delete does not exist.") {
        throw new Error("NO TASKS FOUND"); // using same error message as above so we can use the same error handler later
      } else {
        console.error(e);
        throw new Error("DB Error");
      }
    });

    return;
  }
}
