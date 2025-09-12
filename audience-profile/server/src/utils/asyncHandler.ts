import { Context } from "hono";
import { appError } from "./appError";

type Handler = (c : Context) => Promise<any>

export const asyncHandler = (fn: Handler) => {
    return async (c: Context)=> {
        try {
            return await fn(c)
        } catch (error) {
            return c.json({
                message :  error instanceof Error ? error.message : "Unknown error"
            })
        }
    }
}