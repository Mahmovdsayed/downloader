import { Hono } from "hono";

const youtubeRoutes = new Hono();

youtubeRoutes.get("/search");

export default youtubeRoutes;
