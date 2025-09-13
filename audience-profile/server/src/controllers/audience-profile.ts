import { Context } from "hono";
import { generateAudienceProfile } from "../utils/geminiResponse";
import { appResponse } from "../utils/appResponse";
import { appError } from "../utils/appError"
export class audienceProfile{
    static async getProfile(c: Context){
        const body = await c.req.json()
        const desc = body.desc
        const response = await generateAudienceProfile(c,desc)
        if(!response){
            throw new appError(500,"Response from gemini not found")
        }

        const profiles : string = response.response.candidates?.[0].content.parts?.[0].text || ""
        const FormattedProfileInJson = JSON.parse(profiles)
        return c.json(new appResponse(200,"Audience profile generated",true,FormattedProfileInJson))
    }
}