import type { Job } from "bullmq"

export const generatePosts = async (job: Job) => {
    console.log(`listening on job ${job.id}`)
}