import CircularGallery from "@/components/CircularGallery";
import { FlipWords } from "@/components/ui/flip-words";
import { Timeline } from "@/components/ui/timeline";
import { ProductForm } from "@/components/productForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Eye, Target, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";

interface Campaign {
    id: string;
    name: string;
    status: 'active' | 'draft' | 'completed' | 'paused';
    startDate: string;
    endDate: string;
    budget: number;
    impressions: number;
    clicks: number;
    conversions: number;
    description: string;
    targetAudience: string;
    platform: string[];
    createdAt: string;
}

export const Home = () => {
    const words = ["Social media posts", "Ads", "Email drafts", "Target audience"];
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imgURL, setImgURL] = useState<string | null>(null);

    // Mock campaigns data
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        {
            id: "1",
            name: "Summer Sale Campaign",
            status: "active",
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            budget: 5000,
            impressions: 125000,
            clicks: 3200,
            conversions: 180,
            description: "Promoting summer collection with 30% discount across all social media platforms",
            targetAudience: "Young adults 18-35, fashion enthusiasts",
            platform: ["Instagram", "Facebook", "Twitter"],
            createdAt: "2024-05-15"
        },
        {
            id: "2",
            name: "Product Launch - Smart Watch",
            status: "draft",
            startDate: "2024-09-01",
            endDate: "2024-10-15",
            budget: 8000,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            description: "Launching new smartwatch with advanced health monitoring features",
            targetAudience: "Tech enthusiasts, fitness conscious individuals 25-45",
            platform: ["Instagram", "LinkedIn", "YouTube"],
            createdAt: "2024-08-20"
        },
        {
            id: "3",
            name: "Black Friday Deals",
            status: "completed",
            startDate: "2024-11-20",
            endDate: "2024-11-30",
            budget: 12000,
            impressions: 450000,
            clicks: 15600,
            conversions: 890,
            description: "Annual Black Friday promotion with up to 70% discount",
            targetAudience: "Bargain hunters, general consumers 18-65",
            platform: ["Instagram", "Facebook", "Google Ads", "TikTok"],
            createdAt: "2024-10-01"
        },
        {
            id: "4",
            name: "Holiday Email Campaign",
            status: "paused",
            startDate: "2024-12-01",
            endDate: "2024-12-25",
            budget: 3000,
            impressions: 85000,
            clicks: 1200,
            conversions: 45,
            description: "Holiday themed email marketing campaign for gift suggestions",
            targetAudience: "Existing customers, holiday shoppers 25-55",
            platform: ["Email", "Instagram"],
            createdAt: "2024-11-15"
        }
    ]);

    const content = [
        {
            title: "AI-Powered Post Creation",
            description:
                "Generate engaging social media posts instantly with our AI agent. Craft captions, headlines, and content ideas automatically, saving time while boosting engagement. Let your campaigns run smarter, not harder.",
            content: (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
                    AI-Powered Post Creation
                </div>
            ),
        },
        {
            title: "AI-Powered Ad Creation",
            description:
                "See your posts come to life in real time. Our platform adapts to the latest trends and audience insights, ensuring every post is optimized for maximum impact without manual effort.",
            content: (
                <div className="flex h-full w-full items-center justify-center text-[#F48120]">
                    AI Ad Creation
                </div>
            ),
        },
        {
            title: "Email Draft creater",
            description:
                "Keep track of all generated posts and iterations. Review, edit, or reuse any previous version with ease, maintaining consistency and control over your social media strategy.",
            content: (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
                    Email Draft Creator
                </div>
            ),
        },
        {
            title: "Generates your products ideal target audience",
            description:
                "Our AI agent continuously suggests new post ideas and variations. Stay ahead of your content calendar and never face writer's block again, with fresh, relevant content ready at your fingertips.",
            content: (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
                    Target Audience Generator
                </div>
            ),
        },
    ];

    const getStatusColor = (status: Campaign['status']) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'draft': return 'bg-gray-500';
            case 'completed': return 'bg-blue-500';
            case 'paused': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: Campaign['status']) => {
        switch (status) {
            case 'active': return 'Active';
            case 'draft': return 'Draft';
            case 'completed': return 'Completed';
            case 'paused': return 'Paused';
            default: return 'Unknown';
        }
    };

    return (
        <div className="z-10">
            {/* Hero Section */}
            <div className="mt-10 flex justify-center text-5xl font-bold">
                We help you create and get
                <FlipWords words={words} />
            </div>

            {/* Circular Gallery */}
            <div style={{ height: '600px', position: 'relative' }}>
                <CircularGallery bend={3} borderRadius={0.05} scrollEase={0.02} />
            </div>

            {/* Timeline */}
            {/* <div className="mt-10">
                <Timeline data={content} />
            </div> */}

            {/* Campaigns Section */}
            <div className="mt-16 px-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold" style={{ color: "#0f172a" }}>AI Marketing Campaigns</h2>
                        <p style={{ color: "#404041" }} className="mt-2">Automated marketing campaigns with AI-generated content</p>
                    </div>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button className="text-white" style={{ backgroundColor: "#F48120" }}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle style={{ color: "#0f172a" }}>Create New AI Marketing Campaign</DialogTitle>
                            </DialogHeader>
                            <ProductForm setPostLoading={setLoading} setimgURL={setImgURL} />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Single Column Campaign Cards */}
                <div className="space-y-6 mb-8">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="hover:shadow-xl transition-all duration-300 border-2" style={{ borderColor: "#F48120", backgroundColor: "#ffffff" }}>
                            <CardHeader className="pb-4" style={{ borderBottom: "1px solid #F48120" }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold" style={{ color: "#0f172a" }}>
                                            {campaign.name}
                                        </CardTitle>
                                        <div className="flex items-center mt-2" style={{ color: "#404041" }}>
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className="text-white text-sm px-3 py-1" style={{ backgroundColor: getStatusColor(campaign.status).replace('bg-', '#') }}>
                                        {getStatusText(campaign.status)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* AI Automation Overview */}
                                    <div className="lg:col-span-2">
                                        <h4 className="font-semibold mb-3 flex items-center" style={{ color: "#0f172a" }}>
                                            <Target className="w-4 h-4 mr-2" style={{ color: "#F48120" }} />
                                            AI Automation Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                <p className="text-sm font-medium" style={{ color: "#0f172a" }}>Campaign Description:</p>
                                                <p className="text-sm mt-1" style={{ color: "#404041" }}>{campaign.description}</p>
                                            </div>
                                            <div className="p-3 rounded-lg" style={{ backgroundColor: "#404041", opacity: "0.1" }}>
                                                <p className="text-sm font-medium" style={{ color: "#0f172a" }}>AI-Generated Target Audience:</p>
                                                <p className="text-sm mt-1" style={{ color: "#404041" }}>{campaign.targetAudience}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generated Content Stats */}
                                    <div>
                                        <h4 className="font-semibold mb-3" style={{ color: "#0f172a" }}>AI Content Generated</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                <span className="text-sm" style={{ color: "#404041" }}>Social Posts</span>
                                                <span className="font-bold" style={{ color: "#F48120" }}>{Math.floor(Math.random() * 50) + 10}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                <span className="text-sm" style={{ color: "#404041" }}>Email Drafts</span>
                                                <span className="font-bold" style={{ color: "#F48120" }}>{Math.floor(Math.random() * 20) + 5}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                <span className="text-sm" style={{ color: "#404041" }}>Ad Creatives</span>
                                                <span className="font-bold" style={{ color: "#F48120" }}>{Math.floor(Math.random() * 15) + 8}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div>
                                        <h4 className="font-semibold mb-3" style={{ color: "#0f172a" }}>Performance</h4>
                                        <div className="space-y-3">
                                            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                <p className="text-lg font-bold" style={{ color: "#F48120" }}>${campaign.budget.toLocaleString()}</p>
                                                <p className="text-xs" style={{ color: "#404041" }}>Budget</p>
                                            </div>
                                            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                <p className="text-lg font-bold" style={{ color: "#F48120" }}>{campaign.conversions.toLocaleString()}</p>
                                                <p className="text-xs" style={{ color: "#404041" }}>Conversions</p>
                                            </div>
                                            {campaign.clicks > 0 && (
                                                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                    <p className="text-lg font-bold" style={{ color: "#F48120" }}>
                                                        {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%
                                                    </p>
                                                    <p className="text-xs" style={{ color: "#404041" }}>Conv. Rate</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid #F48120", opacity: "0.3" }}>
                                    <div className="flex flex-wrap gap-2">
                                        {campaign.platform.map((platform) => (
                                            <Badge key={platform} variant="outline" className="text-xs" style={{ borderColor: "#F48120", color: "#F48120" }}>
                                                {platform}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="text-white"
                                                style={{ backgroundColor: "#F48120", borderColor: "#F48120" }}
                                                onClick={() => setSelectedCampaign(campaign)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Full Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl" style={{ color: "#0f172a" }}>{selectedCampaign?.name}</DialogTitle>
                                            </DialogHeader>
                                            {selectedCampaign && (
                                                <div className="space-y-6">
                                                    {/* Status and Campaign Info */}
                                                    <div className="p-6 rounded-lg" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <Badge className="text-white px-3 py-1" style={{ backgroundColor: getStatusColor(selectedCampaign.status).replace('bg-', '#') }}>
                                                                {getStatusText(selectedCampaign.status)}
                                                            </Badge>
                                                            <div className="flex items-center" style={{ color: "#404041" }}>
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                <span>{new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <p className="font-medium mb-2" style={{ color: "#0f172a" }}>Campaign Description:</p>
                                                        <p style={{ color: "#404041" }}>{selectedCampaign.description}</p>
                                                    </div>

                                                    {/* AI-Generated Content Breakdown */}
                                                    <div>
                                                        <h3 className="font-semibold mb-4 flex items-center" style={{ color: "#0f172a" }}>
                                                            <Target className="w-5 h-5 mr-2" style={{ color: "#F48120" }} />
                                                            AI Content Generation Breakdown
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                                <h4 className="font-semibold mb-2" style={{ color: "#0f172a" }}>Social Media Posts</h4>
                                                                <p className="text-2xl font-bold mb-2" style={{ color: "#F48120" }}>{Math.floor(Math.random() * 50) + 10}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>AI-generated posts across platforms</p>
                                                            </div>
                                                            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                                <h4 className="font-semibold mb-2" style={{ color: "#0f172a" }}>Email Templates</h4>
                                                                <p className="text-2xl font-bold mb-2" style={{ color: "#F48120" }}>{Math.floor(Math.random() * 20) + 5}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>Personalized email drafts</p>
                                                            </div>
                                                            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                                <h4 className="font-semibold mb-2" style={{ color: "#0f172a" }}>Ad Creatives</h4>
                                                                <p className="text-2xl font-bold mb-2" style={{ color: "#F48120" }}>{Math.floor(Math.random() * 15) + 8}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>Visual and text ad variations</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* AI Target Audience Analysis */}
                                                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#404041", opacity: "0.1" }}>
                                                        <h3 className="font-semibold mb-3" style={{ color: "#0f172a" }}>
                                                            AI-Generated Target Audience Analysis
                                                        </h3>
                                                        <p style={{ color: "#404041" }}>{selectedCampaign.targetAudience}</p>
                                                    </div>

                                                    {/* Performance Analytics */}
                                                    <div>
                                                        <h3 className="font-semibold mb-4 flex items-center" style={{ color: "#0f172a" }}>
                                                            <TrendingUp className="w-5 h-5 mr-2" style={{ color: "#F48120" }} />
                                                            Campaign Performance Analytics
                                                        </h3>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                                <p className="text-2xl font-bold" style={{ color: "#F48120" }}>${selectedCampaign.budget.toLocaleString()}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>Total Budget</p>
                                                            </div>
                                                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                                <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{selectedCampaign.impressions.toLocaleString()}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>Impressions</p>
                                                            </div>
                                                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                                <p className="text-2xl font-bold" style={{ color: "#0f172a" }}>{selectedCampaign.clicks.toLocaleString()}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>Clicks</p>
                                                            </div>
                                                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#F48120", opacity: "0.1" }}>
                                                                <p className="text-2xl font-bold" style={{ color: "#F48120" }}>{selectedCampaign.conversions.toLocaleString()}</p>
                                                                <p className="text-sm" style={{ color: "#404041" }}>Conversions</p>
                                                            </div>
                                                        </div>

                                                        {selectedCampaign.clicks > 0 && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                                    <p className="text-xl font-bold" style={{ color: "#F48120" }}>
                                                                        {((selectedCampaign.clicks / selectedCampaign.impressions) * 100).toFixed(2)}%
                                                                    </p>
                                                                    <p className="text-sm" style={{ color: "#404041" }}>Click-through Rate</p>
                                                                </div>
                                                                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#0f172a", opacity: "0.1" }}>
                                                                    <p className="text-xl font-bold" style={{ color: "#F48120" }}>
                                                                        {((selectedCampaign.conversions / selectedCampaign.clicks) * 100).toFixed(2)}%
                                                                    </p>
                                                                    <p className="text-sm" style={{ color: "#404041" }}>Conversion Rate</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Platform Distribution */}
                                                    <div>
                                                        <h3 className="font-semibold mb-3" style={{ color: "#0f172a" }}>Marketing Platforms</h3>
                                                        <div className="flex flex-wrap gap-3">
                                                            {selectedCampaign.platform.map((platform) => (
                                                                <Badge key={platform} className="px-3 py-1" style={{ backgroundColor: "#F48120", color: "#ffffff" }}>
                                                                    {platform}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Creation Timeline */}
                                                    <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: "#404041", opacity: "0.1" }}>
                                                        <Clock className="w-4 h-4 mr-2" style={{ color: "#F48120" }} />
                                                        <span className="text-sm" style={{ color: "#404041" }}>
                                                            Campaign created on {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};