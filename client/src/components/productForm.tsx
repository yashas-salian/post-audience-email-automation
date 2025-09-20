"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, X, DollarSign, Building2, Package, FileText, ImageIcon, Check } from "lucide-react"

interface FormData {
  productName: string
  companyName: string
  description: string
  price: string
  image: File | null
}

interface FormErrors {
  productName?: string
  companyName?: string
  description?: string
  price?: string
}

export function ProductForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    companyName: "",
    description: "",
    price: "",
    image: null,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required"
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after success
    setTimeout(() => {
      setFormData({
        productName: "",
        companyName: "",
        description: "",
        price: "",
        image: null,
      })
      setIsSubmitted(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto border-2 border-accent/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Product Added Successfully!</h3>
          <p className="text-muted-foreground">Your product has been added to the catalog.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-2 border-[#F48120] bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-[#F48120]">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Product Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Name */}
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
              className={`h-12 text-base transition-all duration-200 ${
                errors.productName
                  ? "border-[#F48120] focus:border-[#F48120]"
                  : "border-[#F48120] focus:border-[#F48120] focus:ring-2 focus:ring-[#F48120]"
              }`}
            />
            {errors.productName && (
              <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                {errors.productName}
              </p>
            )}
          </div>

          {/* Company Name */}
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
              className={`h-12 text-base transition-all duration-200 ${
                errors.companyName
                  ? "border-[#F48120] focus:border-[#F48120]"
                  : "border-[#F48120] focus:border-[#F48120] focus:ring-2 focus:ring-[#F48120]"
              }`}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                {errors.companyName}
              </p>
            )}
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
              className={`text-base resize-none transition-all duration-200 ${
                errors.description
                  ? "border-[#F48120] focus:border-[#F48120]"
                  : "border-[#F48120] focus:border-[#F48120] focus:ring-2 focus:ring-[#F48120]"
              }`}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                  {errors.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{formData.description.length}/500 characters</p>
              )}
            </div>
          </div>

          {/* Product Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Product Image{" "}
              <Badge variant="secondary" className="ml-2">
                Optional
              </Badge>
            </Label>

            {formData.image ? (
              <div className="relative">
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
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  Drop your image here, or <span className="text-primary">browse</span>
                </p>
                <p className="text-sm text-muted-foreground">Supports: JPG, PNG, GIF up to 10MB</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            )}
          </div>

          {/* Price */}
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
                className={`h-12 text-base pl-10 transition-all duration-200 ${
                  errors.price
                  ? "border-[#F48120] focus:border-[#F48120]"
                  : "border-[#F48120] focus:border-[#F48120] focus:ring-2 focus:ring-[#F48120]"
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">{errors.price}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-semibold bg-[#F48120] hover:bg-accent/90 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Adding Product...
                </div>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
