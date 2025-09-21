"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  X,
  DollarSign,
  Building2,
  Package,
  FileText,
  ImageIcon,
  Mail,
  Users,
  Calendar,
  MessageSquare,
  Star,
  Target,
  Hash,
} from "lucide-react"

interface FormData {
  // Basic Product Info
  productName: string
  companyName: string
  description: string
  price: string
  image: File | null

  features: string[]
  usp: string
  postDescription: string
  campaignStartDate: string
  campaignEndDate: string
  socialMediaHandles: {
    instagram: string
    facebook: string
    twitter: string
    linkedin: string
    tiktok: string
  }
  companyEmail: string
  previousCustomerEmails: string
  postsPerDay: string
  feedback: string
}

interface FormErrors {
  productName?: string
  companyName?: string
  description?: string
  price?: string
  usp?: string
  postDescription?: string
  companyEmail?: string
  postsPerDay?: string
}

export const ProductForm = ({
  setPostLoading,
  setimgURL,
}: {
  setPostLoading: React.Dispatch<React.SetStateAction<boolean>>
  setimgURL: React.Dispatch<React.SetStateAction<null | string>>
}) => {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    companyName: "",
    description: "",
    price: "",
    image: null,
    features: [],
    usp: "",
    postDescription: "",
    campaignStartDate: "",
    campaignEndDate: "",
    socialMediaHandles: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      tiktok: "",
    },
    companyEmail: "",
    previousCustomerEmails: "",
    postsPerDay: "1",
    feedback: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [dragActive, setDragActive] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof FormData, value: string | any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  const handleSocialMediaChange = (platform: keyof FormData["socialMediaHandles"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMediaHandles: {
        ...prev.socialMediaHandles,
        [platform]: value,
      },
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, image: file }))
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, image: file }))
      }
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePostGen = async () => {
    try {
      setPostLoading(true)
      // Simulate API call with enhanced form data
      console.log("[v0] Generating campaign with data:", formData)

      // Mock response
      setTimeout(() => {
        setimgURL("https://placeholder.svg?height=400&width=600&query=marketing+campaign+generated")
        setPostLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating campaign:", error)
      setPostLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Product Information */}
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Product Name & Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Product Name
              </Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                placeholder="Enter your product name"
                className="h-12 text-base"
              />
              {errors.productName && <p className="text-sm text-destructive">{errors.productName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Name
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Enter your company name"
                className="h-12 text-base"
              />
              {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Product Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your product in detail..."
              rows={4}
              className="text-base resize-none"
            />
            <p className="text-sm text-muted-foreground">{formData.description.length}/500 characters</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Product Features
            </Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a product feature"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && addFeature()}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usp" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Unique Selling Proposition (USP)
            </Label>
            <Textarea
              id="usp"
              value={formData.usp}
              onChange={(e) => handleInputChange("usp", e.target.value)}
              placeholder="What makes your product unique and different from competitors?"
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {/* Price & Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className="h-12 text-base pl-10"
                />
              </div>
            </div>

            {/* Product Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Product Image
                <Badge variant="secondary" className="ml-2">
                  Optional
                </Badge>
              </Label>

              {formData.image ? (
                <div className="border-2 border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{formData.image.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop image here or <span className="text-primary">browse</span>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Campaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Post Description */}
          <div className="space-y-2">
            <Label htmlFor="postDescription" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Post Description Template
            </Label>
            <Textarea
              id="postDescription"
              value={formData.postDescription}
              onChange={(e) => handleInputChange("postDescription", e.target.value)}
              placeholder="Describe the style and tone for your social media posts..."
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {/* Campaign Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaignStartDate" className="text-sm font-semibold text-foreground">
                Campaign Start Date
              </Label>
              <Input
                id="campaignStartDate"
                type="date"
                value={formData.campaignStartDate}
                onChange={(e) => handleInputChange("campaignStartDate", e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignEndDate" className="text-sm font-semibold text-foreground">
                Campaign End Date
              </Label>
              <Input
                id="campaignEndDate"
                type="date"
                value={formData.campaignEndDate}
                onChange={(e) => handleInputChange("campaignEndDate", e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* Posts Per Day */}
          <div className="space-y-2">
            <Label htmlFor="postsPerDay" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Posts Per Day
            </Label>
            <Select value={formData.postsPerDay} onValueChange={(value) => handleInputChange("postsPerDay", value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select posts per day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 post per day</SelectItem>
                <SelectItem value="2">2 posts per day</SelectItem>
                <SelectItem value="3">3 posts per day</SelectItem>
                <SelectItem value="4">4 posts per day</SelectItem>
                <SelectItem value="5">5 posts per day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-primary/20">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Contact & Social Media
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Company Email */}
          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Company Email
            </Label>
            <Input
              id="companyEmail"
              type="email"
              value={formData.companyEmail}
              onChange={(e) => handleInputChange("companyEmail", e.target.value)}
              placeholder="company@example.com"
              className="h-12"
            />
          </div>

          {/* Social Media Handles */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-foreground">Social Media Handles</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.socialMediaHandles).map(([platform, handle]) => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform} className="text-sm capitalize">
                    {platform}
                  </Label>
                  <Input
                    id={platform}
                    value={handle}
                    onChange={(e) =>
                      handleSocialMediaChange(platform as keyof FormData["socialMediaHandles"], e.target.value)
                    }
                    placeholder={`@your${platform}handle`}
                    className="h-10"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Previous Customer Emails */}
          <div className="space-y-2">
            <Label
              htmlFor="previousCustomerEmails"
              className="text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Previous Customer Emails
              <Badge variant="secondary" className="ml-2">
                Optional
              </Badge>
            </Label>
            <Textarea
              id="previousCustomerEmails"
              value={formData.previousCustomerEmails}
              onChange={(e) => handleInputChange("previousCustomerEmails", e.target.value)}
              placeholder="Enter customer emails separated by commas (for retargeting campaigns)"
              rows={3}
              className="text-base resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These emails will be used for creating lookalike audiences and retargeting campaigns
            </p>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Feedback
              <Badge variant="secondary" className="ml-2">
                Optional
              </Badge>
            </Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
              placeholder="Any additional requirements, preferences, or feedback for the campaign..."
              rows={4}
              className="text-base resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="button"
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={handlePostGen}
        >
          Generate AI Marketing Campaign
        </Button>
      </div>
    </div>
  )
}
