import { Context } from "hono";
import { geminiSingleton } from "../../../../share/gemini";
import { appError } from "../utils/appError";
import { captionAndHashtagSchema } from "@/models/geminiTextResponse";

interface ProductDetails {
    ID?: string;
    Product_name: string;
    Company_name: string;
    Description: string;
    Price: string;
    Features: string;
    USP: string;
    Post_description: string;
    Start_date?: Date;
    End_date?: Date;
    Status?: string;
    User_ID?: string;
}

export const generateImage = async (
  c: Context,
  productDetails: ProductDetails,
  type: "Ad" | "Social media post",
  prevDayPrompt: String,
  prevDayPerformance?: string,
) => {
  try {
    // const JSONproductDetails = await JSON.parse(productDetails)
    const prompt = `
          You are creating two outputs:

          1. An Instagram-optimized promotional IMAGE for the following product:
            - Product Name: ${productDetails.Product_name}
            - Company Name: ${productDetails.Company_name}
            - Description: ${productDetails.Description}
            - Price: ${productDetails.Price}

          Image Requirements:
          - Modern, eye-catching ${type} style.
          - Product (from uploaded image) centered with lighting & shadows.
          - Text overlays:
            • Headline: Product name
            • Supporting text: Short description
            • Price: Bold and attractive
            • Company name/logo subtle
          - Square format, vibrant colors, minimal premium style.


          Here is the previous Day performance of the post generated from the prompt = ${prevDayPerformance} 
          `;
      const captionPrompt = `
          2. A TEXT OUTPUT with caption and hashtags.

          ⚠️ IMPORTANT: The TEXT OUTPUT must be **only valid JSON** in the following format:
          {
            "caption": "Catchy 2–3 line Instagram caption highlighting product & brand",
            "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"]
          }

          Do not include explanations or any other text outside of this JSON.`

    const imageModel = geminiSingleton.getInstanceForImageModel(c);
    if (!imageModel) {
      throw new appError(500, "Gemini image model not found");
    }

    const responseForImage = await imageModel?.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    } as any);

    const textModel = geminiSingleton.getInstanceForTextModel(c)
    if(!textModel) {
      throw new appError(500, "Gemini text model not found");
    }

    const responseForText = await textModel?.generateContent({
        contents: [{ role: "user", parts: [{ text: captionPrompt }] }],
        generationConfig: {
          responseModalities: ["TEXT"],
          responseSchema :  captionAndHashtagSchema,
          responseMimeType: "application/json"
        },
      } as any);

    return {responseForImage, responseForText};
  } catch (error) {
    throw new appError(
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
