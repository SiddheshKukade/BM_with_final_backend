import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { getSourceCities } from "../utils";
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
            schema: z.object({
              predictions: PredictionsSchema,
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "search endpoint",
        content: {
          "application/json": {
            schema: z.array(
              z.object({
                id: z.string(),
                city: z.string(),
              }),
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const body: SearchInput = await c.req.json();
    const data = getSourceCities(body);
    return c.json(data);
  },
);

export default route;
