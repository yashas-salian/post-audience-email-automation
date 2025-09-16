import { Worker } from "bullmq";
import { generateAds } from "../jobs/ad.js";
import { connection } from "../lib/redis.js";
import { generateAudience } from "../jobs/target-audience.js";
new Worker("Target audience", generateAudience, { connection: connection });
//# sourceMappingURL=target-audience.js.map