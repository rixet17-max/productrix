import app from "./app";

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  console.warn(`Invalid PORT value: "${rawPort}", defaulting to 3000`);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
