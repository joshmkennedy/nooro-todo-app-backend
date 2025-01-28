import { Router, Request, Response, NextFunction } from "express";
import {
  NewTaskInput,
  TaskService,
  UpdateTaskInput,
} from "../services/task.service";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class TaskController {
  public router: Router = Router();
  private taskService: TaskService;
	private auth: AuthMiddleware;

  constructor() {
		this.auth = new AuthMiddleware();
    this.taskService = new TaskService();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeRoutes() {
		this.router.use(this.auth.initialize)
    // GET /tasks
    this.router.get("/", this.getAllTasks);

    this.router.get("/:id", this.getTask);

    // POST /tasks
    this.router.post("/", this.createTask);

    // PUT /tasks/:id
    this.router.put("/:id", this.updateTask);

    // DELETE /tasks/:id
    this.router.delete("/:id", this.deleteTask);
  }

  private getAllTasks = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | any> => {
    try {
      const tasks = await this.taskService.getAll().catch(next);
      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  };

  private getTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | any> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      const task = await this.taskService.getTask(taskId).catch(next);
      if (task) {
        res.status(200).json({
          success: true,
          data: task,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  private createTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | any> => {
    let data = req.body;
    try {
      const task = await this.taskService
        .createTask(this.validateNewTaskInput(data))
        .catch(next);
      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (e) {
      next(e);
    }
  };

  private updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any | void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const updates = req.body; // { title?, color?, completed? }
      console.log(updates);
      const updatedTask = await this.taskService
        .updateTask(taskId, this.validateUpdateTaskInput(updates))
        .catch(next);
      res.status(200).json(updatedTask);
    } catch (err) {
      next(err);
    }
  };

  private deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | any> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      await this.taskService.deleteTask(taskId).catch(next);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  private initializeErrorHandling() {
    this.router.use(
      (
        error: any,
        request: Request,
        response: Response,
        next: NextFunction,
      ): any | null => {
        if (error.message === "NO TASKS FOUND") {
          return response.status(404).send("Not Found");
        }

        if(error instanceof PrismaClientKnownRequestError ){
        	return response.status(500).send(error.meta?.cause)
        }

				if(error instanceof PrismaClientUnknownRequestError){
					return response.status(500).send(error.message)
				}
        return;
      },
    );
  }

  private validateNewTaskInput(data: unknown): NewTaskInput {
    if (typeof data !== "object" || data == null) {
      throw new Error("No Data was given for the new task");
    }
    if (!("title" in data) || typeof data?.title !== "string") {
      throw new Error("Tasks require a title");
    }
    if (!("color" in data) || typeof data?.color !== "string") {
      throw new Error("Tasks require a color");
    }

    return data as NewTaskInput;
  }

  private validateUpdateTaskInput(data: unknown): UpdateTaskInput {
    if (typeof data !== "object" || data == null) {
      throw new Error("No Data was given for the new task");
    }
    if ("title" in data && typeof data?.title !== "string") {
      throw new Error("Tasks require a title");
    }
    if ("color" in data && typeof data?.color !== "string") {
      throw new Error("Tasks require a color");
    }
    return data as UpdateTaskInput;
  }
}
