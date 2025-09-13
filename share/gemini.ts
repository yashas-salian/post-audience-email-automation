import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai" 
import { Context } from "hono";

export class geminiSingleton{
    private static genAIModelForImageModel : GoogleGenerativeAI | null = null
    private static genAIModelForTextModel : GoogleGenerativeAI | null = null
    private static modelInstanceForImageModel : GenerativeModel | null = null
    private static modelInstanceForTextModel : GenerativeModel | null = null

    static getInstanceForImageModel(c: Context){
        if(!this.genAIModelForImageModel){
                const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
                this.modelInstanceForImageModel = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash-preview-image-generation",
                });
                return this.modelInstanceForImageModel
        }
    }
    static getInstanceForTextModel(c: Context){
        if(!this.genAIModelForTextModel){
                const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
                this.modelInstanceForTextModel = genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                });
                return this.modelInstanceForTextModel
        }
    }
}