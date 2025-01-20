import express, { Express, Request, Response } from "express";
import prisma, {
  getTask,
  getTasks,
  newTask,
  updateTask,
  deleteTask,
} from "./db";
import type { Task } from "./db";
import { validateNewTask, DBErrorMessage } from "./utils";

const app: Express = express();
const port = 3100;

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
//@ts-ignore-next-line
app.post("/tasks/", async (req, res) => {
  let data = req.body;
  try {
    const validatedData = validateNewTask(data);
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

// get a task
//@ts-ignore-next-line
app.get("/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = await getTask(taskId).catch((e) => {
    const errorConfig = DBErrorMessage(e);
    return res
      .status(errorConfig.code)
      .json({ success: false, message: errorConfig.message });
  });

  return res.status(201).json({
    success: true,
    data: task,
  });
});

// update task
//@ts-ignore-next-line
app.put("/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }
  const data = req.body;
  try {
    const validatedData = validateNewTask(data);
    const task = await updateTask(taskId, validatedData).catch((e) => {
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

//@ts-ignore-next-line
app.delete("/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const deletedTask = await deleteTask(taskId).catch((e) => {
    const errorConfig = DBErrorMessage(e);
    return res
      .status(errorConfig.code)
      .json({ success: false, message: errorConfig.message });
  });

  if (deletedTask) {
    return res.status(200).json({
      success: true,
    });
  } else {
    return res.status(500).json({
      success: false,
    });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function shutdown() {
  console.log("Shutting down gracefully...");

  // 1. Disconnect Prisma
  await prisma.$disconnect();
  console.log("Prisma disconnected");

  // 2. Close the HTTP server
  server.close(() => {
    console.log("HTTP server closed");
    // 3. Exit the process or do any other cleanup
    process.exit(0);
  });
}

// Listen for system signals and call our graceful shutdown
process.on("SIGINT", shutdown); // e.g. CTRL+C in terminal
process.on("SIGTERM", shutdown); // signals from hosting platforms
