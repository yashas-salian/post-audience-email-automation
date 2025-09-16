import { Queue } from "bullmq"
import {  connection } from "../lib/redis.js"

export const emailQueue = new Queue("Email",{connection})