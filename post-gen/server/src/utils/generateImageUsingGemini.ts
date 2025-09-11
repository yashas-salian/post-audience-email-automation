import { GoogleGenerativeAI } from "@google/generative-ai";
import { triggerAsyncId } from "async_hooks";
import { Context } from "hono";

export const generateImage = async (c : Context, desc : string, type : "Ad" | "Social media post") => {
    try {
        const prompt = `Create a high-quality, eye-catching ${type} for ${desc}.
        The design should be visually appealing, modern, and suitable for Instagram, LinkedIn, and Twitter.
        Focus on highlighting the product’s key value visually.
        Use balanced colors, clean composition, and clear focal points.
        Do not include text in the image.`;

        const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-preview-image-generation",
        });

        return await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      } as any);
      
    } catch (error) {
        
    }
} 