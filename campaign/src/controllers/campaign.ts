import { Context } from "hono";
import { generateCampaign } from "../utils/generateCampaign";
import { appError } from "../utils/appError";
import { appResponse } from "../utils/appReponse";

export class campaignController{
    static async generate(c: Context){
        const body = await c.req.json()
        const desc = body.desc
        const duration = body.duration
        const response = await generateCampaign(c,desc,duration)
        if(!response){
            throw new appError(500,"Response from gemini not found")
        }

        const profiles : string = response.response.candidates?.[0].content.parts?.[0].text || ""
        const FormattedProfileInJson = JSON.parse(profiles)
        return c.json(new appResponse(200,"Audience profile generated",true,FormattedProfileInJson))
    }
}