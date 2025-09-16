import { Worker } from "bullmq";
import { generateAds } from "../jobs/ad.js";
import { connection } from "../lib/redis.js";
import { generateEmails } from "../jobs/email.js";
new Worker("Email", generateEmails, { connection: connection });
//# sourceMappingURL=email.js.map