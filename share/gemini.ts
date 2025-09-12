import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai" 
import { Context } from "hono";

export const getgeminiModel = (c: Context) => {
        const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-preview-image-generation",
        });

        return model
}


export class geminiSingleton{
    private static genAIModel : GoogleGenerativeAI | null = null
    private static modelInstance : GenerativeModel | null = null

    static getInstance(c: Context){
            if(!this.genAIModel){
                const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
                this.modelInstance = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash-preview-image-generation",
                });
            }
        return this.modelInstance
    }
}