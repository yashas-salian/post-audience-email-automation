import { PrismaClient } from "@prisma/client"
import { Redis } from "@upstash/redis"
export class Singleton{
    private static PrismaInstance : PrismaClient | null = null
    private static redisInstance : Redis | null = null

    static getPrismaInstance(){
        if(!this.PrismaInstance){
            this.PrismaInstance = new PrismaClient({
                log: ["info"]
            })
        }
        return this.PrismaInstance
    }
    static getRedisInstance(){
        if(!this.redisInstance){
            this.redisInstance = new Redis({
                url: process.env.REDIS_URL,
                token: process.env.REDIS_TOKEN
            })
        }
        return this.redisInstance
    }

}

export const prisma = Singleton.getPrismaInstance()
export const redis = Singleton.getRedisInstance()