import { Hono } from "hono";
import { campaignController } from "../controllers/campaign.js";

export const campaignRouter = new Hono()

campaignRouter.post('/generate-campaign',campaignController.generate)