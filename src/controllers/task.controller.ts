import { Router, Request, Response } from "express";
import {
  NewTaskInput,
  TaskService,
  UpdateTaskInput,
} from "../services/task.service";

export class TaskController {
  public router: Router = Router();
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // GET /tasks
    this.router.get("/", this.getAllTasks);

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
  ): Promise<void | any> => {
    try {
      const tasks = await this.taskService.getAll();
      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  };

  private createTask = async (
    req: Request,
    res: Response,
  ): Promise<void | any> => {
    let data = req.body;
    try {
      const task = await this.taskService.createTask(
        this.validateNewTaskInput(data),
      );
      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  };

  private updateTask = async (
    req: Request,
    res: Response,
  ): Promise<any | void> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const updates = req.body; // { title?, color?, completed? }
      const updatedTask = await this.taskService.updateTask(
        taskId,
        this.validateUpdateTaskInput(updates),
      );
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  };

  private deleteTask = async (
    req: Request,
    res: Response,
  ): Promise<void | any> => {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      await this.taskService.deleteTask(taskId);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: err });
    }
  };

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
