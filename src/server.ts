import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


//HOME
app.get("/tasks", (req, res) => {
	let tasks = [];
	res.status(200).json({
		success: true,
		data: tasks,
	});
});

//update tasks
app.post("/tasks", (req, res) => {
	let tasks = [];
	return res.status(201).json({
		success: true,
		data: tasks,
	});
});

// update task
app.put("/tasks/:id", (req: Request, res: Response): any => {
	let task = {};

	return res.status(200).json({
		success: true,
		data: task,
	});
});

app.delete("/tasks/:id", (req: Request, res: Response): any => {

	return res.status(200).json({
		success: true,
	});
})

// Start the server
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
