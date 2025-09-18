import type { Job } from "bullmq"
import axios from "axios";
import { InstagramPostingService } from "../utils/postToInstagram.js";

export const generatePosts = async (job: Job) => {
    console.log(`listening on job ${job.id}`)
     const { productDetails, prevDayPerformance } = job.data;
    
    try {
        // Step 1: Generate today's prompt based on performance
        console.log('Generating prompt based on performance...');
        const generateTodaysPrompt = await axios.post(' https://campaign.yashassalian40.workers.dev/generate-campaign', {
            productDetails,
            prevDayPerformance
        });
        
        // Step 2: Generate image and caption
        console.log('Generating image and content...');
        const postResponse = await axios.post('https://my-worker.yashassalian40.workers.dev/generate-image/social-post', {
            productDetails,
            prompt: generateTodaysPrompt.data.FormattedProfileInJson.posts?.[0].prompt, // Use the generated prompt
            type: "Social media post"
        });

        const { Caption, Hashtags } = generateTodaysPrompt.data.FormattedProfileInJson.posts?.[0];
        const { secure_url } = postResponse.data;
        
        // Step 3: Initialize Instagram service
        const instagramService = new InstagramPostingService(
            process.env.INSTAGRAM_ACCESS_TOKEN!,
            process.env.INSTAGRAM_ACCOUNT_ID!
        );
        
        // Step 4: Validate the Cloudinary URL
        if (!instagramService.validateCloudinaryUrl(secure_url)) {
            throw new Error(`Invalid Cloudinary URL format: ${secure_url}`);
        }
        
        // Step 5: Post to Instagram
        console.log('Posting to Instagram...');
        const responseFromInstagram = await instagramService.postImageFromCloudinary(
            secure_url,
            Caption,
            Hashtags || []
        );
        
        if (!responseFromInstagram.success) {
            throw new Error(`Instagram posting failed: ${responseFromInstagram.error}`);
        }
        
        console.log(`Successfully posted to Instagram: ${responseFromInstagram.postId}`);
        
        // Step 6: Return success data
        return {
            success: true,
            postId: responseFromInstagram.postId,
            secure_url,
            Caption,
            Hashtags,
            prompt: generateTodaysPrompt.data.prompt,
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
}