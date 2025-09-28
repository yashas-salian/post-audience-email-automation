import { SchemaType } from "@google/generative-ai";

export const PostSchema = {
  type: SchemaType.OBJECT,
  properties: {
  
    posts: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          Prompt: { type: SchemaType.STRING },
          Caption: { type: SchemaType.STRING },
          Hashtags: { type: SchemaType.ARRAY, 
                      items: {type: SchemaType.STRING},
                      nullable: true },

        },
        required: ["Prompt", "Caption"],
      },
    },
      },
  required: ["posts"],
}
