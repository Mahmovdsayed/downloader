import { Hono } from "hono";
import youtubeRoutes from "./modules/youtube/youtube.routes";
import { logger } from "hono/logger";

const app = new Hono().basePath("/v1");
app.use(logger());

app.route("/youtube", youtubeRoutes);
export default app;
