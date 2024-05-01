import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { compress } from "hono/compress";
import { logger } from "hono/logger";
import search from "./search";
import { customLogger } from "./utils";
import { cors } from "hono/cors";
import autoComplete from "./auto-complete";

const app = new OpenAPIHono();

app.use("/api/*", cors());
app.use(logger(customLogger));
app.use(compress());

app.route("/api/search", search);
app.route("/api/auto-complete", autoComplete);

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  }),
);

app.doc("/doc", {
  info: {
    title: "An API",
    version: "v1",
  },
  openapi: "3.1.0",
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
