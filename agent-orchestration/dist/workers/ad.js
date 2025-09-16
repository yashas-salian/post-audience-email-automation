import { Worker } from "bullmq";
import { generateAds } from "../jobs/ad.js";
import { connection } from "../lib/redis.js";
new Worker("Advertisement", generateAds, { connection: connection });
//# sourceMappingURL=ad.js.map