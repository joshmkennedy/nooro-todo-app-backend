import express, { Application } from 'express';
import { TaskController } from './controllers/task.controller';

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
        // Add any other common middleware here (e.g., cors, helmet, etc.)
    }

    private initializeControllers() {
        // Instantiate your controllers and mount them
        const taskController = new TaskController();
        this.app.use('/tasks', taskController.router);
        // Add other controllers here
    }

    public listen() {
        this.app.listen(this.port, () => {
                console.log(`Server running on http://localhost:${this.port}`);
                });
    }
}
