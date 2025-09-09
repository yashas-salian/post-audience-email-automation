import {Hono} from "hono"
import { audienceProfile } from "../controllers/audprofile.contoller"

export const audiencerouter = new Hono()

audiencerouter.get('/get-audience-profile',audienceProfile.getAudienceProfile)