import { Queue } from "bullmq"
import {  connection } from "../lib/redis.js"

export const postQueue = new Queue("Social media post",{connection})