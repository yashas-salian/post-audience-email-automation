import { Runware } from "@runware/sdk-js";
import { Context } from "hono";

export class imageGenerator {
    static async postGenerator(c: Context) {
        try {
            const body = await c.req.json();
            const desc = body.desc;

            const prompt = `Create a high-quality, eye-catching social media post image for ${desc}...`;

            const runware = await Runware.initialize({
                apiKey: c.env.RUNWARE_API_KEY,
                timeoutDuration: 25000, // 25 seconds - under most platform limits
            });

            const result = await runware.requestImages({
                positivePrompt: prompt,
                model: "runware:101@1",
                width: 512,
                height: 512,
                numberofImages: 1,
            });

            return c.json({ result }, 200);

        } catch (error) {
            console.error('Image generation error:', error);
            
            if (error.message?.includes('timeout')) {
                return c.json({ 
                    error: 'Image generation timed out. Please try again.' 
                }, 408);
            }
            
            return c.json({ 
                error: 'Failed to generate image',
                details: error.message 
            }, 500);
        }
    }
}