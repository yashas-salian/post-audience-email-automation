import { Context } from "hono";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class imageGenerator {
  static async postGenerator(c: Context) {
    try {
      const { desc } = await c.req.json();

      const prompt = `Create a high-quality, eye-catching social media post image for ${desc}.
      The design should be visually appealing, modern, and suitable for Instagram, LinkedIn, and Twitter.
      Focus on highlighting the product’s key value visually.
      Use balanced colors, clean composition, and clear focal points.
      Do not include text in the image.`;

      const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      } as any);

      const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
        (part) => "inlineData" in part
      ) as { inlineData: { mimeType: string; data: string } } | undefined;

      if (!imagePart) {
        return c.json({ error: "No social media postimage returned from Gemini" }, 500);
      }

      const byteArray = Uint8Array.from(
        atob(imagePart.inlineData.data),
        (ch) => ch.charCodeAt(0)
      );
      const file = new Blob([byteArray], { type: imagePart.inlineData.mimeType });

      const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = c.env.CLOUDINARY_UPLOAD_PRESET;
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);

      const response = await fetch(cloudinaryUrl, { method: "POST", body });
      if (!response.ok) throw new Error("Cloudinary upload failed");

      const data = await response.json();

      return c.json({ url: data.secure_url });
    } catch (err) {
      console.error(err);
      return c.json({ error: "Social media post image generation or upload failed" }, 500);
    }
  }

  static async adGenerator(c: Context) {
    try {
      const { desc } = await c.req.json();

      const prompt = `Create a high-quality, eye-catching ad image for ${desc}.
      The design should be visually appealing, modern, and suitable for Instagram, LinkedIn, and Twitter.
      Focus on highlighting the product’s key value visually.
      Use balanced colors, clean composition, and clear focal points.
      Do not include text in the image.`;

      const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      } as any);

      const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
        (part) => "inlineData" in part
      ) as { inlineData: { mimeType: string; data: string } } | undefined;

      if (!imagePart) {
        return c.json({ error: "No ad image returned from Gemini" }, 500);
      }

      const byteArray = Uint8Array.from(
        atob(imagePart.inlineData.data),
        (ch) => ch.charCodeAt(0)
      );
      const file = new Blob([byteArray], { type: imagePart.inlineData.mimeType });

      const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = c.env.CLOUDINARY_UPLOAD_PRESET;
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);

      const response = await fetch(cloudinaryUrl, { method: "POST", body });
      if (!response.ok) throw new Error("Cloudinary upload failed");

      const data = await response.json();

      return c.json({ url: data.secure_url });
    } catch (err) {
      console.error(err);
      return c.json({ error: "Ad image generation or upload failed" }, 500);
    }
  }

}
