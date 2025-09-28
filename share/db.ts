import { PrismaClient } from "@prisma/client"
import { Redis } from "@upstash/redis/cloudflare"
import { Context } from "hono"
import { withAccelerate } from "@prisma/extension-accelerate"

type AcceleratePrisma = ReturnType<PrismaClient["$extends"]>
declare global {
  var __prisma: PrismaClient | undefined;
}
export class Singleton{
    private static PrismaInstance : AcceleratePrisma | null = null
    private static redisInstance : Redis | null = null
    
  //   static getPrismaInstance(c: Context) {
  //   console.log("creating prisma");

  //   if (!this.PrismaInstance) {
  //       console.log(c.env.DATABASE_URL)
  //     this.PrismaInstance = new PrismaClient({
  //       datasourceUrl: c.env.DATABASE_URL,
  //       log: ["info"],
  //     }).$extends(withAccelerate());
  //   }

  //   console.log("Done prisma");
  //   return this.PrismaInstance;
  // }

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

// export const prisma = Singleton.getPrismaInstance()