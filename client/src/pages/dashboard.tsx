"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import {
  PenTool,
  Megaphone,
  Mail,
  Users,
  FolderOpen,
  Plus,
  BarChart3,
  Calendar,
  TrendingUp,
  Eye,
  MousePointer,
  AlertCircle,
} from "lucide-react"
import logo from "../../public/background-image-3.png"
import PillNav from "@/components/PillNav"
import { Footer } from "@/components/footer"
import SpotlightCard from "@/components/SpotlightCard"
import { useCampaignHook } from "../hooks/use-campaign"

interface Campaign {
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
  User_ID: string
  Posts?: any[]
  Ads?: any[]
}

export default function Dashboard() {
  const [activeMode, setActiveMode] = useState<"microservice" | "campaign">("microservice")
  const { campaign: campaigns } = useCampaignHook()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Set loading to false once campaigns are loaded
  useEffect(() => {
    if (campaigns && campaigns.length >= 0) {
      setLoading(false)
    }
  }, [campaigns])

  const microservices = [
    {
      title: "Social Posts",
      description: "Generate engaging social media content",
      icon: PenTool,
      color: "bg-blue-500",
      stats: "24 posts this week",
    },
    {
      title: "Ads Generator",
      description: "Create compelling ad campaigns",
      icon: Megaphone,
      color: "bg-orange-500",
      stats: "12 ads created",
    },
    {
      title: "Email Marketing",
      description: "Design effective email campaigns",
      icon: Mail,
      color: "bg-green-500",
      stats: "8 campaigns sent",
    },
    {
      title: "Audience Profiling",
      description: "Analyze and segment your audience",
      icon: Users,
      color: "bg-purple-500",
      stats: "5 segments active",
    },
    {
      title: "Asset Library",
      description: "Manage your marketing assets",
      icon: FolderOpen,
      color: "bg-pink-500",
      stats: "156 assets stored",
    },
  ]

  // Calculate campaign statistics
  const activeCampaigns = campaigns.filter((c: Campaign) => 
    c.Status.toLowerCase() === "active" || c.Status.toLowerCase() === "ongoing"
  ).length

  const scheduledCampaigns = campaigns.filter((c: Campaign) => 
    c.Status.toLowerCase() === "scheduled"
  ).length

  const draftCampaigns = campaigns.filter((c: Campaign) => 
    c.Status.toLowerCase() === "draft"
  ).length

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "ongoing":
        return "default"
      case "draft":
        return "secondary"
      case "scheduled":
        return "outline"
      case "paused":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateProgress = (campaign: Campaign) => {
    const now = new Date()
    const start = new Date(campaign.Start_date)
    const end = new Date(campaign.End_date)
    
    if (now < start) return "0%"
    if (now > end) return "100%"
    
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return `${Math.round((elapsed / total) * 100)}%`
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col">
        <div className="absolute left-140">
          <PillNav
            logo={logo}
            logoAlt="Company Logo"
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Services', href: '/services' },
              { label: 'Contact', href: '/contact' }
            ]}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#F48120"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
          />
        </div>
        <header className="bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#F48120]">Marketing Hub</h1>
                <p className="text-sm">Streamline your marketing workflow</p>
              </div>

              {/* Mode Toggle */}
              <Tabs
                value={activeMode}
                onValueChange={(value) => setActiveMode(value as "microservice" | "campaign")}
                className="w-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="microservice">Microservice Mode</TabsTrigger>
                  <TabsTrigger value="campaign">Campaign Mode</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </header>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 ml-6 mr-6 mb-4">
        <Card className="border border-[#F48120]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-chart-1" />
              <span className="text-sm font-medium">Total Views</span>
            </div>
            <p className="text-2xl font-bold mt-1">24.5K</p>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className="border border-[#F48120]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-chart-2" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <p className="text-2xl font-bold mt-1">8.2%</p>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>
        <Card className="border border-[#F48120]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-3" />
              <span className="text-sm font-medium">Conversions</span>
            </div>
            <p className="text-2xl font-bold mt-1">342</p>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>
        <Card className="border border-[#F48120]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-chart-4" />
              <span className="text-sm font-medium">ROI</span>
            </div>
            <p className="text-2xl font-bold mt-1">4.2x</p>
            <p className="text-xs text-muted-foreground">+0.3x from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Spotlight Card */}
      <div className="m-2">
        <SpotlightCard className="custom-spotlight-card text-white p-6 space-y-4" spotlightColor="rgba(244, 129, 32, 0.2)">
          <div className="text-lg font-semibold">Agent Mark</div>
          <div className="text-2xl font-bold">Fasten your marketing campaign by 10x</div>
          <p className="text-sm text-white/80">
            Agent Mark leverages AI-driven strategies to automate content creation, optimize ad targeting, and maximize your ROI. Say goodbye to tedious manual campaigns and hello to smart marketing.
          </p>
          <ul className="list-disc list-inside text-white/90 space-y-1 text-sm">
            <li>Generate social posts, emails, and ads in seconds</li>
            <li>Audience profiling for precise targeting</li>
            <li>Real-time analytics to track performance</li>
            <li>Asset management for all your marketing creatives</li>
          </ul>
        </SpotlightCard>
      </div>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeMode} className="w-full">
          {/* Microservice Mode */}
          <TabsContent value="microservice" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Individual Generators</h2>
                <p className="text-muted-foreground">Use each service independently for quick content creation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {microservices.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-[#F48120] hover:border-primary/20"
                    onClick={() => {
                      if (service.title === "Social Posts") {
                        navigate("/social-generator")
                      } else if (service.title === "Ads Generator") {
                        navigate("/ad-generator")
                      } else if (service.title === "Email Marketing") {
                        navigate("/email-generator")
                      } else if (service.title === "Audience Profiling") {
                        navigate("/audience-profiling")
                      } else if (service.title === "Asset Library") {
                        navigate("/asset-library")
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${service.color} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <CardDescription className="text-sm">{service.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{service.stats}</span>
                        <Button
                          size="sm"
                          className="bg-[#F48120] group-hover:bg-primary group-hover:text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (service.title === "Social Posts") {
                              navigate("/social-generator")
                            } else if (service.title === "Ads Generator") {
                              navigate("/ad-generator")
                            } else if (service.title === "Email Marketing") {
                              navigate("/email-generator")
                            } else if (service.title === "Audience Profiling") {
                              navigate("/audience-profiling")
                            } else if (service.title === "Asset Library") {
                              navigate("/asset-library")
                            }
                          }}
                        >
                          {service.title === "Social Posts"
                            ? "Create Posts"
                            : service.title === "Ads Generator"
                              ? "Create Ads"
                              : service.title === "Email Marketing"
                                ? "Create Emails"
                                : service.title === "Audience Profiling"
                                  ? "Open Profiling"
                                  : service.title === "Asset Library"
                                    ? "Open Library"
                                    : "Open"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Campaign Mode */}
          <TabsContent value="campaign" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Campaign Management</h2>
                <p className="text-muted-foreground">Create and manage end-to-end marketing campaigns</p>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/campaign-wizard")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>

            {/* Campaign Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    Active Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-green-600">{activeCampaigns}</p>
                      <p className="text-sm text-muted-foreground">Running successfully</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    Scheduled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-blue-600">{scheduledCampaigns}</p>
                      <p className="text-sm text-muted-foreground">Ready to launch</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <PenTool className="h-4 w-4 text-orange-600" />
                    </div>
                    Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-orange-600">{draftCampaigns}</p>
                      <p className="text-sm text-muted-foreground">In development</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Campaign List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Manage your marketing campaigns and track performance</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-4">Get started by creating your first marketing campaign</p>
                    <Button onClick={() => navigate("/campaign-wizard")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign: Campaign) => (
                      <div
                        key={campaign.ID}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{campaign.Product_name}</h3>
                            <Badge variant={getStatusVariant(campaign.Status)}>
                              {campaign.Status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Company: {campaign.Campany_name}</span>
                            <span>Progress: {calculateProgress(campaign)}</span>
                            <span>Price: ${campaign.Price}</span>
                            <span>{formatDate(campaign.Start_date)} - {formatDate(campaign.End_date)}</span>
                          </div>
                          {campaign.Features && (
                            <div className="flex gap-1 mt-2">
                              {campaign.Features.split(',').slice(0, 3).map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/campaign/${campaign.ID}`)}
                          >
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer/>
    </div>
  )
}