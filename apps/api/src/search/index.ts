import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { customLogger } from "../utils";

const search = new OpenAPIHono();

search.openapi(
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
    customLogger("from search get function");
    return c.json({
      message: "search url",
    });
  },
);

export default search;
