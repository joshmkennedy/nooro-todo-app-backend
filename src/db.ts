import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default prisma;

export type Task = {
  id: number;
  title: string;
  color: string;
  completed: boolean;
};

export async function getTasks(): Promise<Task[]> {
  const tasks: Task[] = await prisma.task.findMany({
    orderBy: {
      completed: "desc",
    },
  }).catch((e:Error)=>{
     console.error(e);
     throw new Error("DB Error");
	});

  return tasks;
}

export async function getTask(id: number): Promise<Task> {
  const task: Task = await prisma.task
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

export async function newTask(data:Partial<Omit<Task, "id">>):Promise<Task> {
	const task: Task = await prisma.task.create({data}).catch((e:Error)=>{
      console.error(e);
      throw new Error("DB Error");
	})

	return task
}

export async function updateTask(
  id: number,
  data: Partial<Omit<Task, "id">>,
): Promise<Task> {
  const task: Task = await prisma.task
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

export async function deleteTask(id: number): Promise<Task> {
  const task = await prisma.task.delete({ where: { id } }).catch((e: Error) => {
    if (e.toString() == "Record to delete does not exist.") {
      throw new Error("NO TASKS FOUND"); // using same error message as above so we can use the same error handler later
    } else {
      console.error(e);
      throw new Error("DB Error");
    }
  });

	return task
}
