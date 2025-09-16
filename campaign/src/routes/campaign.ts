import { Hono } from "hono";
import { campaignController } from "../controllers/campaign.js";

export const campaignRouter = new Hono()

campaignRouter.get('/generate-campaign',campaignController.generate)