import { Hono } from 'hono'
import { imageGenerator } from '../Controllers/Image-gen'

export const imageRouter = new Hono()
imageRouter.get("/generate-image/social-post",imageGenerator.postGenerator)
imageRouter.get("/generate-image/ad",imageGenerator.adGenerator)
