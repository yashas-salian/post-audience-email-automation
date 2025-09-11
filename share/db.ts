import { PrismaClient } from "@prisma/client"
import { Redis } from "@upstash/redis/cloudflare"
import { Context } from "hono"
export class Singleton{
    private static PrismaInstance : PrismaClient | null = null
    private static redisInstance : Redis | null = null
    static getPrismaInstance(){
        console.log("crearing prisma")
        if(!this.PrismaInstance){
            this.PrismaInstance = new PrismaClient({
                log: ["info"]
            })
        }
        console.log("Done prisma")
        return this.PrismaInstance
    }
    static getRedisInstance(c : Context){
        console.log(c.env.REDIS_URL, c.env.REDIS_TOKEN)
        if(!this.redisInstance){
            this.redisInstance = new Redis({
                url: c.env.REDIS_URL,
                token: c.env.REDIS_TOKEN
            })
        }
        console.log("done redis")
        return this.redisInstance
    }

}

export const prisma = Singleton.getPrismaInstance()