import { Context } from "hono";
import { geminiSingleton } from "../../../share/gemini"
import { appError } from "./appError";
import { CampaignSchema } from "../models/geminiResponseSchema";

export const generateCampaign = async (c : Context, desc : string, duration : string) => {
    try {
        const prompt = `
                      You are a marketing strategist. Based on the following product description:
                      "${desc}" and Duration: "${duration}"
                      
                      Generate a ${duration} week campaign plan
                      `;

        const model = geminiSingleton.getInstanceForTextModel(c)
        if(!model){
          throw new appError(500, "Gemini model not found")
        }

        return await model?.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT"],
          responseSchema :  CampaignSchema,
          responseMimeType: "application/json"
        },
      } as any);
      
    } catch (error) {
        // return c.json({
        //     message : error instanceof Error ? error.message: "Unknown error"
        // })
        throw new appError(500, error instanceof Error ? error.message: "Unknown error")
    }
} 