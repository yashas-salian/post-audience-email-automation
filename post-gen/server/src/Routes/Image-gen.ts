import { Hono } from 'hono'
import { imageGenerator } from '../Controllers/Image-gen'
import { asyncHandler } from '../utils/asyncHandler'

export const imageRouter = new Hono()
imageRouter.get("/generate-image/social-post",asyncHandler(imageGenerator.postGenerator))
imageRouter.get("/generate-image/ad",asyncHandler(imageGenerator.adGenerator))
