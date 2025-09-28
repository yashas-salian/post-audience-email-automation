import { Hono } from "hono";
import { campaignController } from "../controllers/campaign.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const campaignRouter = new Hono()

campaignRouter.get('/campaign', asyncHandler(campaignController.getCampaigns))
campaignRouter.get('/campaign/:id', asyncHandler(campaignController.getCampaignById))
campaignRouter.patch('/campaign/:id/status', asyncHandler(campaignController.updateCampaignStatus))
campaignRouter.post('/campaign/draft', asyncHandler(campaignController.saveDraft))
campaignRouter.post('/campaign/generate', asyncHandler(campaignController.generateCampaign))