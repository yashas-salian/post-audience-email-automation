import { Context } from "hono";

type Handler = (c : Context) => Promise<any>

export const asyncHandler = (fn: Handler) => {
    return async (c: Context)=> {
        try {
            return await fn(c)
        } catch (error) {
            // new appError(500, error instanceof Error ? error.message : "Unknown error")
            return c.json({
                message : error instanceof Error ? error.message : "Unknown error"
            },500)
        }
    }
}