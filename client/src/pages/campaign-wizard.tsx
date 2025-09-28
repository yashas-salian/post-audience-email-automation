"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Save, 
  Play, 
  ImagePlus, 
  Mail, 
  AtSign, 
  Calendar, 
  Hash, 
  DollarSign, 
  NotebookText,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Stepper } from "../components/stepper"
import axios from "axios"

interface CampaignData {
  companyName: string
  productName: string
  productDesc: string
  features: string
  price: string
  usp: string
  productImageFile: File | null
  productImagePreview: string | null
  startDate: string
  endDate: string
  instagramHandle: string
  twitterHandle: string
  linkedinHandle: string
  companyEmail: string
  previousCustomersEmails: string
  postsPerDay: number | ""
  feedback: string
}

export default function CampaignWizard() {
  const [companyName, setCompanyName] = useState("")
  const [productName, setProductName] = useState("")
  const [productDesc, setProductDesc] = useState("")
  const [features, setFeatures] = useState("")
  const [price, setPrice] = useState("")
  const [usp, setUsp] = useState("")

  const [productImageFile, setProductImageFile] = useState<File | null>(null)
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [instagramHandle, setInstagramHandle] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [linkedinHandle, setLinkedinHandle] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [previousCustomersEmails, setPreviousCustomersEmails] = useState("")

  const [postsPerDay, setPostsPerDay] = useState<number | "">("")
  const [feedback, setFeedback] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const steps = ["Company & Product", "Timing & Plan", "Contacts", "Review & Submit"]
  const [step, setStep] = useState(0)

  // Save draft functionality (using memory instead of localStorage)
  const [savedDraft, setSavedDraft] = useState<CampaignData | null>(null)

  const saveDraftAuto = () => {
    const draft = {
      companyName,
      productName,
      productDesc,
      features,
      price,
      usp,
      productImageFile,
      productImagePreview,
      startDate,
      endDate,
      instagramHandle,
      twitterHandle,
      linkedinHandle,
      companyEmail,
      previousCustomersEmails,
      postsPerDay,
      feedback,
    }
    setSavedDraft(draft)
    console.log('Auto-saving draft:', draft)
  }

  useEffect(() => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    if (!startDate) setStartDate(today)
    if (!endDate) setEndDate(nextWeek)
  }, [])

  useEffect(() => {
    saveDraftAuto()
  }, [step])

  const onImageChange = (file: File | null) => {
    setProductImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setProductImagePreview(url)
    } else {
      setProductImagePreview(null)
    }
  }

  const saveDraft = async () => {
    const draft = {
      companyName,
      productName,
      productDesc,
      features,
      price,
      usp,
      startDate,
      endDate,
      instagramHandle,
      twitterHandle,
      linkedinHandle,
      companyEmail,
      previousCustomersEmails,
      postsPerDay,
      feedback,
    }
    
    try {
      // In a real app, send to backend API
      const response = await fetch('/api/campaigns/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      })
      
      if (response.ok) {
        alert("Draft saved!")
      } else {
        throw new Error('Failed to save draft')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      alert("Error saving draft. Please try again.")
    }
  }

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return !!(companyName && productName && productDesc && features && price && usp)
      case 1:
        return !!(startDate && endDate && postsPerDay !== "")
      case 2:
        return !!(companyEmail && previousCustomersEmails)
      default:
        return true
    }
  }

  const submitCampaign = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const productDetails = {
        productName,
        companyName,
        description: productDesc,
        price,
        image: productImageFile,
        features,
        usp,
        postDescription: `Campaign for ${productName} - ${productDesc}`,
      }

      const campaignData = {
        productDetails,
        startDate,
        endDate,
        postsPerDay,
        contacts: {
          companyEmail,
          instagramHandle,
          twitterHandle,
          linkedinHandle,
          previousCustomersEmails,
        },
        feedback,
      }

      const response = await axios.post('http://127.0.0.1:8787/generate', {
       campaignData
      })

      if (!response) {
        // const errorData = await response.json().catch(() => null)
        // throw new Error (Error?.message : 'Failed to create campaign')
      }

      // const result = await response.json()
      setSubmitSuccess(true)

      // Clear saved draft
      setSavedDraft(null)
      
      // Redirect to the new campaign
      setTimeout(() => {
        window.location.href = `/campaign/${response.data.data.ID}`
      }, 2000)

    } catch (error) {
      console.error('Error creating campaign:', error)
      setSubmitError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(steps.length - 1, s + 1))
    } else {
      alert('Please fill in all required fields before proceeding.')
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Campaign Created!</h2>
              <p className="text-muted-foreground mb-4">
                Your campaign has been successfully created and is now being processed.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to campaign dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Campaign Wizard</h1>
                <p className="text-sm text-muted-foreground">
                  Create your marketing campaign in a few simple steps.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={saveDraft} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Stepper steps={steps} currentStep={step} className="mb-6" />

        {submitError && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Company & Product */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company & Product</CardTitle>
                <CardDescription>Basic details about your company and offering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Acme Widget Pro"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productDesc">Product Description *</Label>
                  <Textarea
                    id="productDesc"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    placeholder="Describe what the product does and who it's for"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">
                    Features * <span className="text-muted-foreground">(comma-separated)</span>
                  </Label>
                  <Textarea
                    id="features"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="Fast setup, AI powered, 24/7 support"
                    rows={2}
                    required
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {features
                      .split(",")
                      .map((f) => f.trim())
                      .filter(Boolean)
                      .slice(0, 6)
                      .map((f, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="49.99"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="usp">Unique Selling Proposition *</Label>
                    <Input
                      id="usp"
                      value={usp}
                      onChange={(e) => setUsp(e.target.value)}
                      placeholder="Your unique selling proposition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productImage">Product Image (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <label
                      htmlFor="productImage"
                      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/50"
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Upload image
                    </label>
                    <Input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onImageChange(e.target.files?.[0] || null)}
                    />
                    {productImagePreview && (
                      <img
                        src={productImagePreview}
                        alt="Product preview"
                        className="h-16 w-16 rounded-md object-cover border border-border"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Timing & Plan */}
        {step === 1 && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Timing</CardTitle>
                <CardDescription>Set the time period for the campaign</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Strategy</CardTitle>
                <CardDescription>How frequently should we create content?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="postsPerDay">Posts per day *</Label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="postsPerDay"
                      type="number"
                      min={0}
                      max={10}
                      value={postsPerDay}
                      onChange={(e) => {
                        const v = e.target.value
                        setPostsPerDay(v === "" ? "" : Math.max(0, Math.min(10, Number(v))))
                      }}
                      placeholder="2"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 1-3 posts per day for optimal engagement
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Contacts */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How can customers find and reach you?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyEmail">Company Email *</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="hello@acme.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Social Media Handles (Optional)</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Instagram handle"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Twitter/X handle"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="LinkedIn handle"
                        value={linkedinHandle}
                        onChange={(e) => setLinkedinHandle(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="previousEmails">
                    Customer Email List *{" "}
                    <span className="text-muted-foreground">(comma or newline separated)</span>
                  </Label>
                  <Textarea
                    id="previousEmails"
                    value={previousCustomersEmails}
                    onChange={(e) => setPreviousCustomersEmails(e.target.value)}
                    placeholder="alice@example.com, bob@example.com"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include existing customer emails for targeted campaigns
                  </p>
                </div>

                <div>
                  <Label htmlFor="feedback">Additional Notes (Optional)</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Brand voice, tone preferences, special requirements, etc."
                    rows={3}
                  />
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                    <NotebookText className="h-3.5 w-3.5" />
                    Help us create better content by sharing your brand guidelines or preferences.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>Confirm your details before creating the campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-medium">Company & Product</h3>
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                      <div><strong>Company:</strong> {companyName || "-"}</div>
                      <div><strong>Product:</strong> {productName || "-"}</div>
                      <div><strong>Description:</strong> {productDesc || "-"}</div>
                      <div><strong>Price:</strong> ${price || "-"}</div>
                      <div><strong>USP:</strong> {usp || "-"}</div>
                      <div>
                        <strong>Features:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {features.split(',').filter(Boolean).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {productImagePreview && (
                        <div>
                          <strong>Image:</strong>
                          <img
                            src={productImagePreview}
                            alt="Product preview"
                            className="mt-1 h-20 w-20 rounded-md object-cover border border-border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-medium">Campaign Settings</h3>
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                      <div><strong>Start Date:</strong> {startDate || "-"}</div>
                      <div><strong>End Date:</strong> {endDate || "-"}</div>
                      <div><strong>Posts per Day:</strong> {postsPerDay === "" ? "-" : postsPerDay}</div>
                      <div><strong>Duration:</strong> {
                        startDate && endDate 
                          ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + " days"
                          : "-"
                      }</div>
                    </div>
                    
                    <h3 className="font-medium">Contact Information</h3>
                    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                      <div><strong>Email:</strong> {companyEmail || "-"}</div>
                      {instagramHandle && <div><strong>Instagram:</strong> @{instagramHandle}</div>}
                      {twitterHandle && <div><strong>Twitter:</strong> @{twitterHandle}</div>}
                      {linkedinHandle && <div><strong>LinkedIn:</strong> @{linkedinHandle}</div>}
                      <div><strong>Customer Emails:</strong> {previousCustomersEmails ? `${previousCustomersEmails.split(',').length} contacts` : "-"}</div>
                      {feedback && <div><strong>Notes:</strong> {feedback}</div>}
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your campaign will be created and content generation will begin automatically. 
                    You can monitor progress and make adjustments from the campaign dashboard.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom navigation controls */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex gap-3">
            {step > 0 && (
              <Button 
                variant="secondary" 
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={nextStep} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={submitCampaign} 
                className="bg-primary text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Create Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}