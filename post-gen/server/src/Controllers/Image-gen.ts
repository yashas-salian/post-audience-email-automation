import { Context } from "hono";
import { appResponse } from "../utils/appResponse";
import { generateImage } from "../utils/generateImageUsingGemini";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { appError } from "@/utils/appError";

export class imageGenerator {
  static async postGenerator(c: Context) {

      const { productDetails, type } = await c.req.json();

      const result = await generateImage(c, productDetails, type)
      if(!result) throw new appError(500, "Image generation by gemini failed")

      const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
        (part) => "inlineData" in part
      ) as { inlineData: { mimeType: string; data: string } } | undefined;
      if (!imagePart) {
        throw new appError(500,"No social media post image returned from Gemini")
      }
      const byteArray = Uint8Array.from(
        atob(imagePart.inlineData.data),
        (ch) => ch.charCodeAt(0)
      );

        console.log("MIME Type from Gemini:", imagePart.inlineData.mimeType);
        
      const file = new Blob([byteArray], { type: imagePart.inlineData.mimeType });

      const response = await uploadToCloudinary(c, file)
      if (!response.ok) throw new appError(500,"Cloudinary upload failed");

      const data = await response.json();
      return c.json(new appResponse(200, "Generated post and uploaded to cloudinary", true, data.secure_url))

  }

  static async adGenerator(c: Context) {

      const { desc, type } = await c.req.json();

      const result = await generateImage(c, desc, type)
      if(!result) throw new appError(500, "Image generation by gemini failed")

      const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
        (part) => "inlineData" in part
      ) as { inlineData: { mimeType: string; data: string } } | undefined;
      if (!imagePart) {
        throw new appError(500,"No ad image returned from Gemini")
      }
      const byteArray = Uint8Array.from(
        atob(imagePart.inlineData.data),
        (ch) => ch.charCodeAt(0)
      );
      const file = new Blob([byteArray], { type: imagePart.inlineData.mimeType });

      const response = await uploadToCloudinary(c, file)
      console.log(response)
      if (!response.ok) throw new appError(500,"Cloudinary upload failed");

      const data = await response.json();
      return c.json(new appResponse(200, "Generated ad and uploaded to cloudinary", true, data.secure_url));

  }
}
