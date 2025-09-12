import { Context } from "hono";
import { generateAudienceProfile } from "../utils/geminiResponse";
import { appResponse } from "../utils/appResponse";
import { appError } from "../utils/appError"
export class audienceProfile{
    static async getProfile(c: Context){
        const desc = await c.req.json()
        const response = await generateAudienceProfile(c,desc)
        if(!response){
            throw new appError(500,"Response from gemini not found")
        }
        return new appResponse(200,"Audience profile generated",true,response)
    }
}