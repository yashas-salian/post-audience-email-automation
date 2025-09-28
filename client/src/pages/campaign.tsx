"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Share2,
  Mail,
  Megaphone,
  PenTool,
  Play,
  Pause,
  Copy,
  Edit,
  Download,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
  Clock,
  Target,
  Zap,
  AlertCircle,
  Activity,
  Lightbulb,
  ChevronRight,
  MapPin,
  Heart,
  MessageCircle,
  ExternalLink,
} from "lucide-react"

interface CampaignData {
  ID: string
  Product_name: string
  Campany_name: string
  Description: string
  Price: string
  Features: string
  USP: string
  Post_description: string
  Start_date: string
  End_date: string
  Status: string
  Posts?: Post[]
  Ads?: Ad[]
}

interface Post {
  ID: string
  Day: number
  URL: string
  SURL: string
  Caption?: string
  Hashtags?: string
  Prompt: string
  Campaign_ID: string
}

interface Ad {
  ID: string
  URL: string
  SURL: string
  Product_name: string
  Campany_name: string
  Campaign_ID: string
}

interface CampaignDetailsProps {
  campaignId: string
}

export default function CampaignDetails({ campaignId }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [showTimeline, setShowTimeline] = useState(false)
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaignData()
  }, [campaignId])

  const fetchCampaignData = async () => {
    try {
      setLoading(true)
      // Replace with your actual API endpoint
      const response = await axios.get(`http://127.0.0.1:8788/campaign/${campaignId}`)
      
      if (!response) {
        throw new Error('Failed to fetch campaign data')
      }
      setCampaign(response.data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching campaign:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!campaign) return
    
    try {
      const response = await fetch(`http://127.0.0.1:8787/${campaignId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update campaign status')
      }

      setCampaign({ ...campaign, Status: newStatus })
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return Instagram
      case "linkedin":
        return Linkedin
      case "facebook":
        return Facebook
      case "twitter":
        return Twitter
      case "email":
        return Mail
      default:
        return Globe
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Campaign</h2>
          <p className="text-muted-foreground mb-4">{error || 'Campaign not found'}</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Calculate some mock performance data based on real campaign data
  const daysSinceStart = Math.max(1, Math.floor((new Date().getTime() - new Date(campaign.Start_date).getTime()) / (1000 * 60 * 60 * 24)))
  const totalPosts = campaign.Posts?.length || 0
  const totalAds = campaign.Ads?.length || 0
  
  // Mock performance metrics (in a real app, these would come from analytics APIs)
  const mockPerformance = {
    impressions: Math.floor(Math.random() * 100000) + 50000,
    engagement: +(Math.random() * 10 + 2).toFixed(1),
    ctr: +(Math.random() * 5 + 1).toFixed(1),
    conversions: Math.floor(Math.random() * 500) + 100,
    roi: +(Math.random() * 3 + 2).toFixed(1),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Dashboard</span>
                <ChevronRight className="h-4 w-4" />
                <span>Campaigns</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{campaign.Product_name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Campaign
              </Button>
              {campaign.Status.toLowerCase() === "ongoing" ? (
                <Button variant="outline" size="sm" onClick={() => handleStatusChange("paused")}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleStatusChange("ongoing")}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Campaign Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{campaign.Product_name}</h1>
                <Badge className={getStatusColor(campaign.Status)}>{campaign.Status}</Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(campaign.Start_date)} - {formatDate(campaign.End_date)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{campaign.Campany_name}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTimeline(!showTimeline)}
              className={showTimeline ? "bg-primary/10" : ""}
            >
              <Activity className="h-4 w-4 mr-2" />
              {showTimeline ? "Hide Timeline" : "Show Timeline"}
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-chart-1" />
                  <span className="text-sm font-medium">Price</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${campaign.Price}</p>
                  <p className="text-xs text-muted-foreground">Product pricing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-chart-2" />
                  <span className="text-sm font-medium">Impressions</span>
                </div>
                <p className="text-2xl font-bold">{mockPerformance.impressions.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Est. reach</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-chart-3" />
                  <span className="text-sm font-medium">Engagement</span>
                </div>
                <p className="text-2xl font-bold">{mockPerformance.engagement}%</p>
                <p className="text-xs text-muted-foreground">Avg. engagement</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointer className="h-4 w-4 text-chart-4" />
                  <span className="text-sm font-medium">CTR</span>
                </div>
                <p className="text-2xl font-bold">{mockPerformance.ctr}%</p>
                <p className="text-xs text-muted-foreground">Click-through rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-chart-5" />
                  <span className="text-sm font-medium">Posts</span>
                </div>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-xs text-muted-foreground">Total posts</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{campaign.Description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {campaign.Features.split(',').map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">USP</h4>
                  <p className="text-sm text-muted-foreground">{campaign.USP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Posts ({totalPosts})
                </TabsTrigger>
                <TabsTrigger value="ads" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Ads ({totalAds})
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Posts Tab */}
              <TabsContent value="posts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Posts</CardTitle>
                    <CardDescription>Generated posts for your campaign</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {campaign.Posts && campaign.Posts.length > 0 ? (
                      <div className="space-y-4">
                        {campaign.Posts.map((post) => (
                          <div key={post.ID} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Instagram className="h-5 w-5" />
                                <div>
                                  <p className="font-medium">Day {post.Day}</p>
                                  <p className="text-xs text-muted-foreground">Social Media Post</p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">Generated</Badge>
                            </div>
                            {post.Caption && (
                              <p className="text-sm mb-3">{post.Caption}</p>
                            )}
                            {post.Hashtags && (
                              <p className="text-sm text-blue-600 mb-3">{post.Hashtags}</p>
                            )}
                            {post.URL && (
                              <div className="mb-3">
                                <img
                                  src={post.URL}
                                  alt={`Post for day ${post.Day}`}
                                  className="w-full max-w-md rounded-md border border-border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {post.URL && (
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View Image
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No posts generated yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Posts will appear as they are generated by the campaign</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ads Tab */}
              <TabsContent value="ads" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Advertisement Creatives</CardTitle>
                    <CardDescription>Generated ad creatives for your campaign</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {campaign.Ads && campaign.Ads.length > 0 ? (
                      <div className="space-y-4">
                        {campaign.Ads.map((ad) => (
                          <div key={ad.ID} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Megaphone className="h-5 w-5" />
                                <div>
                                  <p className="font-medium">{ad.Product_name} Ad</p>
                                  <p className="text-xs text-muted-foreground">Advertisement Creative</p>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Generated</Badge>
                            </div>
                            {ad.URL && (
                              <div className="mb-3">
                                <img
                                  src={ad.URL}
                                  alt={`Ad for ${ad.Product_name}`}
                                  className="w-full max-w-md rounded-md border border-border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {ad.URL && (
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View Creative
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No ads generated yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Ad creatives will appear as they are generated</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Details</CardTitle>
                    <CardDescription>Complete information about this campaign</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Basic Information</h4>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Company:</dt>
                            <dd>{campaign.Campany_name}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Product:</dt>
                            <dd>{campaign.Product_name}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Price:</dt>
                            <dd>${campaign.Price}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Status:</dt>
                            <dd>
                              <Badge className={getStatusColor(campaign.Status)}>
                                {campaign.Status}
                              </Badge>
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Campaign Timeline</h4>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Start Date:</dt>
                            <dd>{formatDate(campaign.Start_date)}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">End Date:</dt>
                            <dd>{formatDate(campaign.End_date)}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Duration:</dt>
                            <dd>{Math.ceil((new Date(campaign.End_date).getTime() - new Date(campaign.Start_date).getTime()) / (1000 * 60 * 60 * 24))} days</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{campaign.Description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Post Description</h4>
                      <p className="text-sm text-muted-foreground">{campaign.Post_description}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Campaign Insights
                </CardTitle>
                <CardDescription>Key metrics and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Campaign Progress</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {daysSinceStart} days running, {totalPosts} posts generated
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Content Performance</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posts are being generated automatically based on your campaign settings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Next Steps</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Monitor post performance and adjust targeting as needed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline View */}
        {showTimeline && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Campaign Timeline
              </CardTitle>
              <CardDescription>Visual overview of all campaign activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.Posts && campaign.Posts.length > 0 ? (
                  campaign.Posts.map((post, index) => (
                    <div key={post.ID} className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Post Generated - Day {post.Day}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.Caption ? post.Caption.substring(0, 100) + '...' : 'Social media post'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Generated
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Campaign timeline will update as content is generated</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}