import app from "./app";

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled Rejection:", reason);
});

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  console.warn(`Invalid PORT value: "${rawPort}", defaulting to 3000`);
}

console.log(`Starting server on port ${port} (0.0.0.0)...`);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

server.on("error", (err) => {
  console.error("[FATAL] Server error:", err);
});
