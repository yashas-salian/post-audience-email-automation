import { Queue } from "bullmq"
import {  connection } from "../lib/redis.js"

export const audienceQueue = new Queue("Target audience",{connection})