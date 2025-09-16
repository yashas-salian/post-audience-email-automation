import { Queue } from "bullmq";
import { connection } from "../lib/redis.js";
export const postQueue = new Queue("social media post", { connection });
//# sourceMappingURL=social-media-post.js.map