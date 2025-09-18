// ===== COMPLETE INSTAGRAM POSTING JOB =====
// jobs/social-media.ts
import type { Job } from "bullmq";
import axios from "axios";
import { InstagramPostingService } from "../utils/postToInstagram.js";

export const generateAds = async (job: Job) => {
    console.log(`Generating social media post - Job ${job.id}`);
    
    const { productDetails } = job.data;
    
    try {
        // Step 1: Generate today's prompt based on performance
        console.log('Generating prompt based on performance...');
        // const generateTodaysPrompt = await axios.post(' https://campaign.yashassalian40.workers.dev/generate-campaign', {
        //     productDetails,
        // });
        
        // Step 2: Generate image and caption
        console.log('Generating image and content...');
        const postResponse = await axios.post('https://my-worker.yashassalian40.workers.dev/generate-image/Ad', {
            productDetails,
            // prompt: generateTodaysPrompt.data.FormattedProfileInJson.posts?.[0].prompt, // Use the generated prompt
            type: "Ad"
        });

        // const { Caption, Hashtags } = generateTodaysPrompt.data.FormattedProfileInJson.posts?.[0];
        const { secure_url } = postResponse.data;
        
        // Step 3: Initialize Instagram service
       
        return {
            success: true,
            postResponse,
            secure_url,
            posted: true,
            platform: 'instagram',
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error(`Failed to generate/post social media content: ${error}`);
        
        // Log detailed error information
        if (axios.isAxiosError(error)) {
            console.error('API Error Details:', {
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url
            });
        }
        throw error;
    }
};

