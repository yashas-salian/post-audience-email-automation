import { Context } from "hono";
import { generatePrompt } from "../utils/generateCampaign";
import { appError } from "../utils/appError";
import { appResponse } from "../utils/appReponse";
import { Singleton } from "../../../share/db";
import { getPrismaClient } from "../../../share/prisma";
// import { postQueue } from "../../../agent-orchestration/src/queues/social-media-post";

interface ProductDetails {
  productName: string;
  companyName: string;
  description: string;
  price: string;
  image?: File | null;
  features: string;
  usp: string;
  postDescription: string;
}

export class campaignController {
  static async generateCampaign(c: Context) {
    const body = await c.req.json();
    const productDetails: ProductDetails = body.productDetails;
    const prisma = getPrismaClient(c.env.DATABASE_URL);
    const startDate = new Date(); // now
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const response = await prisma.campaign.create({
      data: {
        Product_name: productDetails.productName,
        Campany_name: productDetails.companyName,
        Description: productDetails.description,
        Price: productDetails.price,
        Features: productDetails.features,
        USP: productDetails.usp,
        Post_description: productDetails.postDescription,
        Start_date: startDate,
        End_date: endDate,
        Status: "ongoing",
        User_ID: "1",
      },
    });

    // await postQueue.add(
    //   `campaign-${response.ID}`,
    //   { productDetails, campaignId: response.ID },
    //   {
    //     repeat: {
    //       every: 24 * 60 * 60 * 1000,
    //       startDate: startDate,
    //       endDate: endDate,
    //     },
    //   }
    // );

    return new appResponse(200, "Campaign created succesfully", true, response);
  }

  static async getCampaigns(c: Context) {
      // const campaignId = c.req.param("id");
      const prisma = getPrismaClient(c.env.DATABASE_URL);

      const campaign = await prisma.campaign.findMany();

      if (!campaign) {
        return c.json(new appResponse(
          200,
          "No Campaign found",
          true,
          campaign
      ))
      }

      return c.json(new appResponse(
        200,
        "Campaign retrieved successfully",
        true,
        campaign
      ))
  }

  static async getCampaignById(c: Context) {
      const campaignId = c.req.param("id");
      const prisma = getPrismaClient(c.env.DATABASE_URL);

      const campaign = await prisma.campaign.findUnique({
        where: { ID: campaignId },
        include: {
          Posts: true,
          Ads: true,
        },
      });

      if (!campaign) {
        return new appError(404, "Campaign not found");
      }

      return c.json(new appResponse(
        200,
        "Campaign retrieved successfully",
        true,
        campaign
      ))
  }

  static async updateCampaignStatus(c: Context) {
      const campaignId = c.req.param("id");
      const { status } = await c.req.json();
      const prisma = getPrismaClient(c.env.DATABASE_URL);

      const campaign = await prisma.campaign.update({
        where: { ID: campaignId },
        data: { Status: status },
      });

      return new appResponse(200, "Campaign status updated", true, campaign);
  }
  static async saveDraft(c: Context) {
      const draftData = await c.req.json();
      // You can store drafts in a separate table or as JSON in the campaign table
      // For now, just return success
      return new appResponse(200, "Draft saved successfully", true, null);
  }
}
