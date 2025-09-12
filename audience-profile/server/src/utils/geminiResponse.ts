import { Context } from "hono";
import { geminiSingleton } from "../../../../share/gemini"

export const generateAudienceProfile = async (c : Context, desc : string) => {
    try {
        const prompt = `Based on the following product description, generate the top 4 customer personas most likely to use or purchase this product. Each persona should be distinct, realistic, and reflect real-world demographics. Return the output only in JSON format with the following fields for each persona:
                        1.Gender
                        2.Region
                        3.PriorityOrder (1 = highest relevance)
                        4.MarketSharePercent (estimated percent of market they represent)
                        5.Occupation
                        6.AgeRange
                        7.IncomeLevel (low, medium, high, or numeric if applicable)
                        8.Interests (list of 3–5 relevant interests or lifestyle traits)
                        Here is the product description: ${desc}`;

        const model = geminiSingleton.getInstance(c)
        if(!model){
          throw new appError(500, "Gemini model not found")
        }

        return await model?.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT"],
        },
      } as any);
      
    } catch (error) {
        return c.json({
            message : error instanceof Error ? error.message: "Unknown error"
        })
    }
} 