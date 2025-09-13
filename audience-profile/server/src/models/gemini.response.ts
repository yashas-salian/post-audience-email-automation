import { SchemaType } from "@google/generative-ai"

export const audienceProfilePersona = {
    type : SchemaType.OBJECT,
    properties :   {
        personas : {
            type : SchemaType.ARRAY,
            items : {
                type : SchemaType.OBJECT,
                properties : {
                    PriorityOrder: { type: SchemaType.NUMBER },
                    Name : {type: SchemaType.STRING},
                    AgeRange: { type: SchemaType.STRING },
                    Gender: { type: SchemaType.STRING },
                    Occupation: { type: SchemaType.STRING },
                    Region: { type: SchemaType.STRING },
                    Interests: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING }
                    },
                    LifeStyle : { type: SchemaType.STRING },
                    BuyingMotivation : { type: SchemaType.STRING },
                    PreferredMarketingChannel : { type: SchemaType.STRING },
                    IncomeLevel: { type: SchemaType.STRING },
                    MarketSharePercent: { type: SchemaType.NUMBER },
                },
                required : [
                    "PriorityOrder",
                    "Name",
                    "AgeRange",
                    "Gender",
                    "Occupation",
                    "Region",
                    "Interests",
                    "LifeStyle",
                    "BuyingMotivation",
                    "PreferredMarketingChannel",
                    "IncomeLevel",
                    "MarketSharePercent",
                ]
            }
        }
    },
    required: ["personas"]
}