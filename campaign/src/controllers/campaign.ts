import { Context } from "hono";
import { generateCampaign } from "../utils/generateCampaign";
import { appError } from "../utils/appError";
import { appResponse } from "../utils/appReponse";
import { Singleton } from "../../../share/db"

export class campaignController{
    static async generate(c: Context){
        const body = await c.req.json()
        const productDetails = body.productDetails
        const prevDayPerformance = body.prevDayPerformance
        const response = await generateCampaign(c,productDetails,prevDayPerformance)
        if(!response){
            throw new appError(500,"Response from gemini not found")
        }

        const profiles : string = response.response.candidates?.[0].content.parts?.[0].text || ""
        const FormattedProfileInJson = JSON.parse(profiles)
        const redis = Singleton.getRedisInstance(c)
        const campaignID =`cmp_${crypto.randomUUID()}`
        await redis.set(`${campaignID}`,JSON.stringify(FormattedProfileInJson))
        await redis.sadd("campaign:index", campaignID);
        return c.json(new appResponse(200,"Audience profile generated",true,{FormattedProfileInJson,campaignID}))
    }
}