import { Context } from "hono";
import { geminiSingleton } from "../../../../share/gemini"
import { appError } from "./appError";
import { audienceProfilePersona } from "../models/gemini.response";

export const generateAudienceProfile = async (c : Context, desc : string) => {
    try {
        const prompt = `
                      You are a marketing strategist. Based on the following product description:
                      "${desc}"
                      
                      Generate 3 detailed customer personas. For each persona, include:
                      - Priority order
                      - Name
                      - Age range
                      - Gender
                      - Occupation (what they do, like are they student , teacher , lawyer , blogger etc)
                      - Region
                      - Interests
                      - Lifestyle
                      - Buying motivation
                      - Preferred marketing channel (social, email, offline, etc.)
                      - Income level
                      - Market Share
                      `;

        const model = geminiSingleton.getInstanceForTextModel(c)
        if(!model){
          throw new appError(500, "Gemini model not found")
        }

        return await model?.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT"],
          responseSchema :  audienceProfilePersona,
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