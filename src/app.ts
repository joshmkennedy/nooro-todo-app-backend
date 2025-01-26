import express, { Application } from "express";
import cors from "cors";
import { TaskController } from "./controllers/task.controller";
import { Server } from "http";

export class App {
  public app: Application;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: "*" })); // fix in production
  }

  private initializeControllers() {
    // Instantiate your controllers and mount them
    const taskController = new TaskController();
    this.app.use("/tasks", taskController.router);
    // Add other controllers here
  }


  public listen(): Server {
    return this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
