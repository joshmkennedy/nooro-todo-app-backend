import express, { Express, Request, Response } from "express";
import { getTask, getTasks, newTask, updateTask, deleteTask } from "./db";
import type { Task } from "./db";
import { validateNewTask, DBErrorMessage } from "./utils";

const app: Express = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

//HOME
app.get("/tasks", async (req, res) => {
	const tasks = await getTasks().catch((e) => {
		const errorConfig = DBErrorMessage(e);
		return res
			.status(errorConfig.code)
			.json({ success: false, message: errorConfig.message });
	});

	res.status(200).json({
		success: true,
		data: tasks,
	});
});

//insert tasks
app.post("/tasks/", async (req, res) => {
	let data = req.body;
	try {
		const validatedData: Partial<Omit<Task, "id">> = validateNewTask(data);
		const task = await newTask(validatedData).catch((e) => {
			const errorConfig = DBErrorMessage(e);
			return res
				.status(errorConfig.code)
				.json({ success: false, message: errorConfig.message });
		});

		return res.status(201).json({
			success: true,
			data: task,
		});
	} catch (e) {
		// failed validation
		return res.status(400).json({
			success: false,
			message: e,
		});
	}
});

// update task
app.put("/tasks/:id", async (req: Request, res: Response): any => {
	const taskId = parseInt(req.params.id, 10);
	if (isNaN(taskId)) {
		return res.status(400).json({ message: "Invalid task ID" });
	}
	const data = req.body
	try {
		const validatedData = validateUpdateTask(data)
		const task = await updateTask(validatedData).catch((e) => {
			const errorConfig = DBErrorMessage(e);
			return res
				.status(errorConfig.code)
				.json({ success: false, message: errorConfig.message });
		});

		return res.status(201).json({
			success: true,
			data: task,
		});
	} catch (e) {

	}

});

app.delete("/tasks/:id", (req: Request, res: Response): any => {
	return res.status(200).json({
		success: true,
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
