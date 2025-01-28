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
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | any> => {
		// check if logged in
		if(!request.user?.userId){
			next(new Error("Not Authorized"))
		} 
    try {
      const tasks = await this.taskService.getAll().catch(next);
      response.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  };

  private getTask = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | any> => {
		// check if logged in
		if(!request.user?.userId){
			next(new Error("Not Authorized"))
		} 
    try {
      const taskId = parseInt(request.params.id, 10);
      if (isNaN(taskId)) {
        return response.status(400).json({ message: "Invalid task ID" });
      }
      const task = await this.taskService.getTask(taskId).catch(next);
      if (task) {
        response.status(200).json({
          success: true,
          data: task,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  private createTask = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | any> => {
		// check if logged in
		if(!request.user?.userId){
			next(new Error("Not Authorized"))
		} 

    let data = request.body;
		data.userId = request.user?.userId
    try {
      const task = await this.taskService
        .createTask(this.validateNewTaskInput(data))
        .catch(next);
      response.status(201).json({
        success: true,
        data: task,
      });
    } catch (e) {
      next(e);
    }
  };

  private updateTask = async (
    request: Request,
		response: Response,
    next: NextFunction,
  ): Promise<any | void> => {
		// check if logged in
		if(!request.user?.userId){
			next(new Error("Not Authorized"))
		} 

    const updates = request.body; // { title?, color?, completed? }
		updates.userId = request.user?.userId


    try {
      const taskId = parseInt(request.params.id, 10);
      if (isNaN(taskId)) {
        return response.status(400).json({ message: "Invalid task ID" });
      }

      const updatedTask = await this.taskService
        .updateTask(taskId, this.validateUpdateTaskInput(updates))
        .catch(next);
      response.status(200).json(updatedTask);
    } catch (err) {
      next(err);
    }
  };

  private deleteTask = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void | any> => {
		// check if logged in
		if(!request.user?.userId){
			next(new Error("Not Authorized"))
			return
		} 

    try {
      const taskId = parseInt(request.params.id, 10);
      if (isNaN(taskId)) {
        return response.status(400).json({ message: "Invalid task ID" });
      }
      await this.taskService.deleteTask(taskId, request.user.userId).catch(next);
      response.status(204).send();
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
