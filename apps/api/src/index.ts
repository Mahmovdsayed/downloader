import { Hono } from "hono";

const app = new Hono().basePath("/v1");

app.get("/", (c) => c.json({ message: "Hello from Bun!" }));

export default app;
