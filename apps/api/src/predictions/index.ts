import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { searchText } from "../utils";
import { PredictionsSchema, SearchInput, SearchInputSchema } from "../common";

const route = new OpenAPIHono();

route.openapi(
  createRoute({
    path: "/",
    method: "post",
    post: {},
    request: {
      body: {
        content: {
          "application/json": {
            schema: SearchInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "get predicted values",
        content: {
          "application/json": {
            schema: z.object({
              predictions: PredictionsSchema,
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const body: SearchInput = await c.req.json();
    const predictions = searchText(body);
    return c.json({
      predictions,
    });
  },
);

export default route;
