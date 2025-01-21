import db from "./db";
import "dotenv/config";
import { App } from "./app";

const app = new App(parseInt(process.env.PORT ?? "3100"));
// Start the server
const server = app.listen();

async function shutdown() {
  console.log("Shutting down gracefully...");

  // Disconnect DB
  await db.$disconnect();
  console.log("Prisma disconnected");

  // Close the HTTP server
  server.close(() => {
    console.log("HTTP server closed");
    //Exit the process or do any other cleanup
    process.exit(0);
  });
}

// Listen for system signals and call our graceful shutdown
process.on("SIGINT", shutdown); // e.g. CTRL+C in terminal
process.on("SIGTERM", shutdown); // signals from hosting platforms
