import {Hono} from "hono"
import { audienceprofile } from "../controllers/audprofile.contoller"

export const audiencerouter = new Hono()

audiencerouter.get('/get-audience-profile',audienceprofile.getAudienceProfile)