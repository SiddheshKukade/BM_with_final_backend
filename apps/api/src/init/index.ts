import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { customLogger } from "../utils";
import {TemplateSchema} from "../common";

const route = new OpenAPIHono();


route.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "get application defaults",
        content: {
          "application/json": {
            schema: TemplateSchema,
          },
        },
      },
    },
  }),
  (c) => {
    customLogger("from search get function");
    return c.json({
      default: "please enter search ...",
      prompts: [
        { key: "source" },
        {
          key: "destination",
        },
        { key: "mode" },
        { key: "product" },
        { key: "qty" },
      ],
    });
  },
);

export default route;


/*


{
  "update": "d",
  "predictions": [],
  "prompts": [
    { "key": "source" },
    { "key": "destination"},
    { "key": "mode" },
    { "key": "product" },
    { "key": "qty" }
  ]
}


{
  "update": "delhi mumbai",
  "predictions": [
   { "key" : "destination", "value":  "delhi"}
],
  "prompts": [
    { "key": "source" },
    { "key": "destination"},
    { "key": "mode" },
    { "key": "product" },
    { "key": "qty" }
  ]
}


 */
