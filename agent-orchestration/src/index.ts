import "./workers/ad.js"
import "./workers/email.js"
import "./workers/social-media-post.js"
import "./workers/target-audience.js"

import { JobScheduler } from "./scheduler/index.js";

const productDetails = {
    name: "Your Product Name",
    description: "Your product description",
    category: "Technology",
    price: "$99",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    target_market: "Young professionals"
};
const scheduler = new JobScheduler(productDetails);
scheduler.startAllSchedules();