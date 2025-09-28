import { Context } from "hono";
import { appResponse } from "../utils/appResponse";
import { generateImage } from "../utils/generateImageUsingGemini";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { appError } from "@/utils/appError";
import { getPrismaClient } from "../../../../share/prisma"

export class imageGenerator {
  static async postGenerator(c: Context) {
      const { productDetails, type, prevDayPerformance, campaignId } = await c.req.json();
      const prevDayPrompt = ""
      const {responseForImage, responseForText} = await generateImage(c, productDetails, type, prevDayPrompt,prevDayPerformance)
      if(!responseForImage) throw new appError(500, "Image generation by gemini failed")

      const imagePart = responseForImage.response.candidates?.[0]?.content?.parts?.find(
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
      const prisma = getPrismaClient(c.env.DATABASE_URL)

      // const uploadToDB = await prisma.post.create({
      //   data:{
      //     Day : 1,
      //     URL : data.url,
      //     SURL : data.secure_url,
      //     Campaign_ID : campaignId,
      //     Prompt : ''
      //   }
      // })

      // if(!uploadToDB) throw new appError(500, "Uploading post to DB failed")
      const textPart = responseForText.response.candidates?.[0]?.content?.parts?.find(
        (part) => "text" in part
      ) as { text: string } | undefined;

      let caption = "";
      let hashtags: string[] = [];

      if (textPart?.text) {
        try {
          // Force strict JSON parsing
          const cleaned = textPart.text.trim();
          const parsed = JSON.parse(cleaned);
          caption = parsed.caption || "";
          hashtags = parsed.hashtags || [];
        } catch (err) {
          console.error("Failed to parse caption/hashtags JSON:", textPart.text, err);
        }
      }


      return c.json(new appResponse(200, "Generated post and uploaded to cloudinary", true, {
        image : data.secure_url,
        caption,
        hashtags
      }))

  }

  static async adGenerator(c: Context) {

      const { productDetails, type } = await c.req.json();
      const prevDayPrompt = ""
      const {responseForImage, responseForText} = await generateImage(c, productDetails, type, prevDayPrompt)
      if(!responseForImage) throw new appError(500, "Image generation by gemini failed")

      const imagePart = responseForImage.response.candidates?.[0]?.content?.parts?.find(
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
