import { PrismaClient  } from "@prisma/client";
import db  from "../db";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

export type TaskDTO = {
  id: number;
  title: string;
  color: string;
  completed?: boolean;
	userId:string;
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
          completed: "asc",
        },
      })
      .catch((e: PrismaClientUnknownRequestError|PrismaClientKnownRequestError) => {
        console.error(e);
        throw e
      });

    return tasks;
  }

	//@TODO add userId as parameter to ensure users own task
  public async getTask(id: number): Promise<TaskDTO> {
    const task: TaskDTO | null| void = await this.db.task
      .findUnique({
        where: {
          id,
        },
      })
      .catch((e: PrismaClientUnknownRequestError|PrismaClientKnownRequestError) => {
        console.error(e);
        throw e
      });

    if (!task) {
      throw new Error("NO TASKS FOUND");
    }

    return task;
  }

  public async createTask(taskData: NewTaskInput): Promise<TaskDTO|void> {
    const data: NewTaskInput = {
      ...taskData,
      completed: taskData.completed ?? false,
    };

    const task: TaskDTO|void = await this.db.task
      .create({ data })
      .catch((e: PrismaClientUnknownRequestError|PrismaClientKnownRequestError) => {
        console.error(e);
        throw e
      });

    return task;
  }

  public async updateTask(id: number, data: UpdateTaskInput): Promise<TaskDTO|void> {
    const task: TaskDTO|void = await this.db.task
      .update({
        where: { id },
        data,
      })
      .catch((e: PrismaClientUnknownRequestError|PrismaClientKnownRequestError) => {
        console.error(e);
        throw e
      });
    return task;
  }

  public async deleteTask(id: number): Promise<void> {
    await this.db.task.delete({ where: { id } }).catch((e: PrismaClientUnknownRequestError|PrismaClientKnownRequestError) => {
        console.error(e);
        throw e
      });

    return;
  }

}
