import { Worker } from "bullmq";
import { generateAds } from "../jobs/ad.js";
import { connection } from "../lib/redis.js";
import { generatePosts } from "../jobs/social-media-post.js";


new Worker("Social media post",generatePosts, {connection: connection})