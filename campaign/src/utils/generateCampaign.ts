import { Context } from "hono";
import { geminiSingleton } from "../../../share/gemini"
import { appError } from "./appError";
import { CampaignSchema } from "../models/geminiResponseSchema";

export const generateCampaign = async (c : Context, productDetails : string, prevDayPerformance : string) => {
    try {
        const prompt = `
                      You are a marketing strategist. Based on the following product description:
                      "${productDetails}" and prev day performance: "${prevDayPerformance}. 
                      "Generate me a new JSON with exactly these fields:
                      - imagePrompt (string)
                      - caption (string)
                      - hashtags (array of strings, at least 3 items). 
                      Ensure hashtags are always included."
                      "
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