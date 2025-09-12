import { Context } from "hono";

type Handler = (c : Context) => Promise<any>

export const asyncHandler = (fn: Handler) => {
    return async (c: Context)=> {
        try {
            return await fn(c)
        } catch (error) {
            new appError(500, error instanceof Error ? error.message : "Unknown error")
        }
    }
}