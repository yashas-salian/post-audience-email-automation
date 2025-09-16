import { SchemaType } from "@google/generative-ai";

export const CampaignSchema = {
  type: SchemaType.OBJECT,
  properties: {
    // Target audience (generated once per campaign)
    // targetAudience: {
    //   type: SchemaType.OBJECT,
    //   properties: {
    //     Description: { type: SchemaType.STRING },      
    //     AgeRange: { type: SchemaType.STRING },
    //     Gender: { type: SchemaType.STRING },
    //     Occupation: { type: SchemaType.STRING },
    //     Region: { type: SchemaType.STRING },
    //     Interests: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    //     LifeStyle: { type: SchemaType.STRING },
    //     BuyingMotivation: { type: SchemaType.STRING },
    //     PreferredMarketingChannel: { type: SchemaType.STRING },
    //     IncomeLevel: { type: SchemaType.STRING },
    //     MarketSharePercent: { type: SchemaType.NUMBER },
    //   },
    //   required: [
    //     "Description",
    //     "AgeRange",
    //     "Gender",
    //     "Occupation",
    //     "Region",
    //     "Interests",
    //     "LifeStyle",
    //     "BuyingMotivation",
    //     "PreferredMarketingChannel",
    //     "IncomeLevel",
    //     "MarketSharePercent",
    //   ],
    // },

    // Daily posts
    posts: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          Day: { type: SchemaType.NUMBER },
          Content: { type: SchemaType.STRING },
          MediaPrompt: { type: SchemaType.STRING },
        },
        required: ["Day", "Content"],
      },
    },

    // Weekly ads
    // ads: {
    //   type: SchemaType.ARRAY,
    //   items: {
    //     type: SchemaType.OBJECT,
    //     properties: {
    //       Week: { type: SchemaType.NUMBER },
    //       AdPrompt: { type: SchemaType.STRING },
    //       Platform: { type: SchemaType.STRING },
    //       CTA: { type: SchemaType.STRING },
    //     },
    //     required: ["Week", "AdPrompt"],
    //   },
    // },

    // Weekly emails
//     emails: {
//       type: SchemaType.ARRAY,
//       items: {
//         type: SchemaType.OBJECT,
//         properties: {
//           Week: { type: SchemaType.NUMBER },
//           Subject: { type: SchemaType.STRING },
//           Body: { type: SchemaType.STRING },
//         },
//         required: ["Week", "Subject", "Body"],
//       },
//     },
  },

  required: ["posts"],
}
