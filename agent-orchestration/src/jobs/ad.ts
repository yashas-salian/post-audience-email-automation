import type { Job } from "bullmq";

export const generateAds = async (job: Job) => {
    console.log(`listening on job ${job.id}`)
}