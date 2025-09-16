import { Context } from "hono";
import { geminiSingleton } from "../../../../share/gemini"
import { appError } from "../utils/appError"
import app from "..";
export const generateImage = async (c : Context, desc : string, type : "Ad" | "Social media post") => {
    try {
        const prompt = `Create a high-quality, eye-catching ${type} for ${desc}.
        The design should be visually appealing, modern, and suitable for Instagram, LinkedIn, and Twitter.
        Focus on highlighting the product’s key value visually.
        Use balanced colors, clean composition, and clear focal points.
        Do not include text in the image.`;

        const model = geminiSingleton.getInstanceForImageModel(c)
        if(!model){
          throw new appError(500, "Gemini model not found")
        }

        return await model?.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      } as any);
      
    } catch (error) {
      throw new appError(500,error instanceof Error ? error.message: "Unknown error")
    }
} 