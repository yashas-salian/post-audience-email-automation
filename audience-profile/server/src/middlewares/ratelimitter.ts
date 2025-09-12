import { Context, Next } from "hono";
import { Singleton } from "../../../../share/db"

export const ratelimmiter = async(c : Context, next : Next) => {
    try {
        const redis = Singleton.getRedisInstance(c)
        const TIME_LIMIT = 60
        const WINDOW = 10
        const ip = c.req.header("x-forwarded-for") || 
                c.req.header("cf-connecting-ip") || 
                c.req.header("CF-Connecting-IP") ||
                c.req.header("x-real-ip") ||
                "unknown";
        const path = new URL(c.req.url).pathname;
        const cacheKey = `${ip}:${path}`
        
        const count = await redis.incr(cacheKey)
        if(count === 1){
            const ok = await redis.expire(cacheKey, TIME_LIMIT)
            if(ok !== 1){
                 return c.json({ error: "Rate limit setup failed" }, 429);
            }
        }
        if(count > WINDOW){
            return c.json({ 
                error: "Too many requests", 
                retryAfter: TIME_LIMIT 
            }, 429);

        }
        await next()
    } catch (error) {
        return c.json({ 
            error: error instanceof Error ? error.message : "Unknown error" 
        }, 500);
    }
    

}