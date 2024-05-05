import {z} from "@hono/zod-openapi";

export const TemplateSchema = z.object({
    default: z.string(),
    prompts: z.array(
        z.object({
            key: z.string(),
        }),
    ),
})


export type Template = z.infer<typeof TemplateSchema> ;

export const PredictionsSchema = z.array(
        z.array(  z.string()),
    );

export const SearchInputSchema = z.object({
    update: z.string(),
    prompts: z.array(
        z.object({
            key: z.string(),
        }),
    ),
    predictions: PredictionsSchema
})


export type SearchInput = z.infer<typeof SearchInputSchema> ;
