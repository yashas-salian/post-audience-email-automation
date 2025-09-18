import cron from 'node-cron';
import { postQueue } from '../queues/social-media-post.js';


export class JobScheduler {
    private productDetails: any;
    
    constructor(productDetails: any) {
        this.productDetails = productDetails;
    }
    private async getPreviousDayPerformance() {
        // Example mock data
        // fetch from instagram graph api
        return {
            avgLikes: 200,
            avgComments: 15,
            engagementRate: 0.065,
            bestPerformingPost: {
                postId: "abc123",
                content: "Yesterday’s top post 🚀",
                likes: 300,
                comments: 25
            }
        };
    }
    // Schedule daily social media posts at 10:00 AM
    scheduleDailySocialMedia() {
        cron.schedule('0 10 * * *', async () => {
            console.log('Scheduling daily social media post');
            
            // Get previous day's performance data
            const previousDayPerformance = await this.getPreviousDayPerformance();
            
            await postQueue.add('generate-daily-post', {
                productDetails: this.productDetails,
                previousDayPerformance,
                timestamp: new Date().toISOString()
            });
        });
    }

    startAllSchedules() {
        this.scheduleDailySocialMedia();
        console.log('All job schedules started');
    }
}