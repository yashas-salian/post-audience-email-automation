import type { RedisOptions } from "bullmq"
// import { Redis } from "@upstash/redis"
import 'dotenv/config'
export const connection : RedisOptions = {
    host: process.env.REDIS_URL,
    port: 6379,
    username: "default",
    password: process.env.REDIS_PASSWORD || ""
}


// export const redis = new Redis(connection)