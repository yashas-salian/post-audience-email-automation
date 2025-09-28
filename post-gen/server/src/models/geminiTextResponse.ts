import { SchemaType } from "@google/generative-ai";

export const captionAndHashtagSchema = {
  type: SchemaType.OBJECT,
  properties: {
    caption: {
      type: SchemaType.STRING,
      description: "Catchy Instagram caption (2–3 lines)",
    },
    hashtags: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "7–10 relevant Instagram hashtags",
      nullable: true, // allow empty or null if none
    },
  },
  required: ["caption"], // hashtags optional
};
