import { Queue } from "bullmq"
import {  connection } from "../lib/redis.js"

export const adQueue = new Queue("Advertisement",{connection})

