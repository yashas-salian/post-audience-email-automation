// ===== INSTAGRAM POSTING SERVICE WITH CLOUDINARY =====
// services/instagramPosting.ts
import axios from 'axios';

export class InstagramPostingService {
    private accessToken: string;
    private accountId: string;
    
    constructor(accessToken: string, accountId: string) {
        this.accessToken = accessToken;
        this.accountId = accountId;
    }
    async postImageFromCloudinary(
        cloudinaryUrl: string, 
        caption: string, 
        hashtags: string[] = []
    ) {
        try {
            console.log('Starting Instagram post with Cloudinary URL:', cloudinaryUrl);
            
            // Step 1: Create media container
            const mediaContainer = await this.createMediaContainer(
                cloudinaryUrl, 
                caption, 
                hashtags
            );
            
            // Step 2: Publish the media
            const publishResult = await this.publishMedia(mediaContainer.id);
            
            console.log('Successfully posted to Instagram:', publishResult.id);
            
            return {
                success: true,
                postId: publishResult.id,
                containerId: mediaContainer.id,
                message: 'Posted successfully to Instagram'
            };
            
        } catch (error) {
            console.error('Failed to post to Instagram:', error);
            
            // Handle specific Instagram API errors
            if (axios.isAxiosError(error)) {
                const errorData = error.response?.data?.error;
                return {
                    success: false,
                    error: errorData || error.message,
                    message: 'Failed to post to Instagram',
                    statusCode: error.response?.status
                };
            }
            
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                message: 'Failed to post to Instagram'
            };
        }
    }

    /**
     * Step 1: Create media container with Cloudinary URL
     */
    private async createMediaContainer(
        imageUrl: string, 
        caption: string, 
        hashtags: string[]
    ) {
        // Combine caption with hashtags
        const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;
        
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${this.accountId}/media`,
            {
                image_url: imageUrl,  // Your Cloudinary URL goes here
                caption: fullCaption,
                access_token: this.accessToken
            }
        );
        
        console.log('Media container created:', response.data.id);
        return response.data;
    }
    
    /**
     * Step 2: Publish the media container
     */
    private async publishMedia(containerId: string) {
        // Wait a bit before publishing (Instagram recommendation)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${this.accountId}/media_publish`,
            {
                creation_id: containerId,
                access_token: this.accessToken
            }
        );
        
        console.log('Media published:', response.data.id);
        return response.data;
    }
    
    /**
     * Post multiple images as carousel (album)
     */
    async postCarouselFromCloudinary(
        cloudinaryUrls: string[], 
        caption: string, 
        hashtags: string[] = []
    ) {
        try {
            console.log('Creating carousel with', cloudinaryUrls.length, 'images');
            
            // Step 1: Create media containers for each image
            const mediaContainers = [];
            
            for (const imageUrl of cloudinaryUrls) {
                const container = await axios.post(
                    `https://graph.facebook.com/v18.0/${this.accountId}/media`,
                    {
                        image_url: imageUrl,
                        is_carousel_item: true,
                        access_token: this.accessToken
                    }
                );
                
                mediaContainers.push(container.data.id);
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Step 2: Create carousel container
            const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;
            
            const carouselContainer = await axios.post(
                `https://graph.facebook.com/v18.0/${this.accountId}/media`,
                {
                    media_type: 'CAROUSEL',
                    children: mediaContainers.join(','),
                    caption: fullCaption,
                    access_token: this.accessToken
                }
            );
            
            // Step 3: Publish carousel
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const publishResult = await axios.post(
                `https://graph.facebook.com/v18.0/${this.accountId}/media_publish`,
                {
                    creation_id: carouselContainer.data.id,
                    access_token: this.accessToken
                }
            );
            
            return {
                success: true,
                postId: publishResult.data.id,
                containerId: carouselContainer.data.id,
                message: 'Carousel posted successfully to Instagram'
            };
            
        } catch (error) {
            console.error('Failed to post carousel:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message: "Unknown error",

            };
        }
    }
    
    /**
     * Post video from Cloudinary URL
     */
    async postVideoFromCloudinary(
        videoUrl: string, 
        thumbnailUrl: string, 
        caption: string, 
        hashtags: string[] = []
    ) {
        try {
            console.log('Posting video from Cloudinary:', videoUrl);
            
            const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;
            
            // Create video media container
            const mediaContainer = await axios.post(
                `https://graph.facebook.com/v18.0/${this.accountId}/media`,
                {
                    media_type: 'VIDEO',
                    video_url: videoUrl,
                    thumbnail_url: thumbnailUrl, // Optional but recommended
                    caption: fullCaption,
                    access_token: this.accessToken
                }
            );
            
            // Wait longer for video processing
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Publish video
            const publishResult = await axios.post(
                `https://graph.facebook.com/v18.0/${this.accountId}/media_publish`,
                {
                    creation_id: mediaContainer.data.id,
                    access_token: this.accessToken
                }
            );
            
            return {
                success: true,
                postId: publishResult.data.id,
                containerId: mediaContainer.data.id,
                message: 'Video posted successfully to Instagram'
            };
            
        } catch (error) {
            console.error('Failed to post video:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message: "Unknown error",

            };
        }
    }
    
    /**
     * Validate Cloudinary URL format
     */
    validateCloudinaryUrl(url: string): boolean {
        // Basic Cloudinary URL validation
        const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/[^\/]+\/(image|video)\/upload\/.+\.(jpg|jpeg|png|gif|mp4|mov)$/i;
        return cloudinaryPattern.test(url);
    }
    
    /**
     * Get media upload status (useful for videos)
     */
    async getMediaStatus(containerId: string) {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/v18.0/${containerId}`,
                {
                    params: {
                        fields: 'status_code,status',
                        access_token: this.accessToken
                    }
                }
            );
            
            return response.data;
            
        } catch (error) {
            console.error('Failed to get media status:', error);
            throw error;
        }
    }
}
