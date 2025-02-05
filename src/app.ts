import express, { Application } from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import { TaskController } from "./controllers/task.controller";
import { Server } from "http";
import { AuthController } from "./controllers/auth.controller";

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
    this.app.use(cors({ origin: "*" })); //TODO: fix in production
		this.app.use(cookieParser())
  }

  private initializeControllers() {
    // Instantiate your controllers and mount them
    const taskController = new TaskController();
    this.app.use("/tasks", taskController.router);
		const authController = new AuthController();
		this.app.use("/auth", authController.router)
    // Add other controllers here
  }


  public listen(): Server {
    return this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
