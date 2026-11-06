import app from "./index";

Bun.serve({
  port: 8080,
  fetch: app.fetch,
});

console.log(`Downloader server running on port 8080`);
