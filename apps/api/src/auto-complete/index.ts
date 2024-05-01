import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { customLogger } from "../utils";

const autoComplete = new OpenAPIHono();

autoComplete.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "search endpoint",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  (c) => {
    customLogger("from auto-complete get function");
    return c.json({
      message: "search url",
    });
  },
);

export default autoComplete;
