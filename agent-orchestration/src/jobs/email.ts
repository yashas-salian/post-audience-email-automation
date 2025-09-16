import type { Job } from "bullmq"

export const generateEmails = async (job: Job) => {
    console.log(`listening on job ${job.id}`)
}