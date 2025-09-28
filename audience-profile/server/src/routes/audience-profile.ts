import { Hono } from "hono";
import { audienceProfile } from "../controllers/audience-profile";
import { asyncHandler } from "../utils/asyncHandler";
import { ratelimmiter } from "../middlewares/ratelimitter";

export const audienceProfileRouter = new Hono()

audienceProfileRouter.post("/get-audience-profile",ratelimmiter,asyncHandler(audienceProfile.getProfile))