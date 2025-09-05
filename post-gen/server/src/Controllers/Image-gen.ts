import { Context } from "hono";
// import {Response} from "@hono/node-server"   

export class imageGenerator{
    static async postGenerator(c:Context){
        const body=await c.req.json()
        const desc = body.desc
        const prompt = `Create a high-quality, eye-catching social media post image for ${desc}. 
        The design should be visually appealing, modern, and suitable for platforms like Instagram, LinkedIn, and Twitter. 
        Focus on highlighting the product’s key value visually — through lifestyle imagery, subtle symbolic elements, or product-centric visuals. 
        Use balanced colors, clean composition, and clear focal points that make the post scroll-stopping and shareable. 
        Do not include text in the image (leave space for captions outside the image). 
        Style: professional, minimal yet engaging, adaptable for both B2B and B2C audiences.
        `
        const image= await c.env.AI.run(
            '@cf/stabilityai/stable-diffusion-xl-base-1.0',
            {prompt}
        )
        return new Response (image,{
            headers:{"Content-Type":"image/png"},
        })
    }
    static async adGenerator(c:Context){

    }
}
