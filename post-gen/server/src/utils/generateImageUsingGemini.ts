import { Context } from "hono";
import { geminiSingleton } from "../../../../share/gemini"
import { appError } from "../utils/appError"

interface ProductDetails {
  productName: string;
  companyName: string;
  description: string;
  price: string;
  image?: File | null;
}

export const generateImage = async (c : Context, productDetails : ProductDetails, type : "Ad" | "Social media post") => {
    try {
        // const JSONproductDetails = await JSON.parse(productDetails)
        const prompt = `
          Generate a professional Instagram post for the product with the following details:

          - Product Name: ${productDetails.productName}
          - Company Name: ${productDetails.companyName}
          - Description: ${productDetails.description}
          - Price: ${productDetails.price}

          Design Requirements:
          - Create a modern, eye-catching social media ${type} style image.
          - Place the product (from the uploaded image) at the center with proper lighting and realistic shadows.
          - Include stylish text overlays for:
            • Product name as the headline
            • Short description as supporting text
            • Price highlighted in a bold, attractive way
            • Company name/logo subtly placed
          - Use Instagram-optimized aesthetics: vibrant colors, clean composition, and a minimal but premium feel.
          - Make sure the design is balanced, scroll-stopping, and suitable for Instagram feed (square format).
          - Add decorative elements (gradients, shapes, subtle glow) to make the product pop.
          - Ensure it looks like a polished brand advertisement, not stock art.
          `;


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