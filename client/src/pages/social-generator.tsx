import { useState } from "react"
import axios from "axios"

interface postDetail {
  Image: string,
  Caption: string,
  Hashtag: string
}

export default function SocialGenerator() {
  const [step, setStep] = useState<"input" | "generated">("input")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"])
  const [selectedVariation, setSelectedVariation] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [postDetails, setPostDetails] = useState<postDetail>({
    Image: "",
    Caption: "",
    Hashtag: ""
  })

  const [formData, setFormData] = useState({
    Product_name: "",
    Company_name: "",
    Description: "",
    Price: "",
    image: null,
    Features: "",
    USP: "",
    Post_description: "",
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    try {
      const responseFormLLM = await axios.post('http://127.0.0.1:8787/generate-image/social-post', { 
        productDetails: formData,
        type : "Social media post"
      }
      )
      setIsGenerating(false)
      setPostDetails(prev => ({
      ...prev,
      Caption: responseFormLLM.data.data.caption,
      Hashtag: responseFormLLM.data.data.hashtags,
      Image: responseFormLLM.data.data.image,
    }));
      setStep("generated")
    } catch (error) {
      setIsGenerating(false)
    }finally{
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('http://127.0.0.1:8787/generate-image/social-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDetails: formData,
          type: "Social media post"
        })
      })
      const responseFormLLM = await response.json()
      setPostDetails(responseFormLLM.data)
      setIsGenerating(false)

    } catch (error) {
      console.error('Error regenerating post:', error)
      setIsGenerating(false)
    }
    setIsGenerating(false)
  }

  // Create posts for each selected platform using postDetails
  const generatePostsForPlatforms = () => {
    return selectedPlatforms.map((platform) => ({
      platform,
      text: postDetails.Caption,
      hashtags: postDetails.Hashtag,
      image: postDetails.Image,
      engagement: {
        likes: Math.floor(Math.random() * 500) + 100,
        comments: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 25) + 5,
      }
    }))
  }

  if (step === "input") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Media Post Generator</h1>
                <p className="text-sm text-gray-600">Create engaging social content with AI</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  ✨
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Social Posts</h2>
                <p className="text-gray-600">
                  Provide some details about your content and we'll create engaging posts for your selected platforms
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Form Fields */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Wireless Headphones, Organic Coffee"
                    value={formData.Product_name}
                    onChange={(e) => setFormData({ ...formData, Product_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., TechCorp, Green Beans Co."
                    value={formData.Company_name}
                    onChange={(e) => setFormData({ ...formData, Company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description *</label>
                  <input
                    type="text"
                    placeholder="Brief description of your product"
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="text"
                    placeholder="e.g., $99, Free, Contact for pricing"
                    value={formData.Price}
                    onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Features *</label>
                  <input
                    type="text"
                    placeholder="e.g., Noise cancelling, 24hr battery"
                    value={formData.Features}
                    onChange={(e) => setFormData({ ...formData, Features: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">USP *</label>
                  <input
                    type="text"
                    placeholder="e.g., Best sound quality in market"
                    value={formData.USP}
                    onChange={(e) => setFormData({ ...formData, USP: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Post Description *</label>
                  <input
                    type="text"
                    placeholder="What should this post achieve?"
                    value={formData.Post_description}
                    onChange={(e) => setFormData({ ...formData, Post_description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Platform Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Target Platforms *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: "instagram", name: "Instagram", desc: "Square posts with hashtags", icon: "📷", color: "from-purple-500 to-pink-500" },
                      { id: "linkedin", name: "LinkedIn", desc: "Professional long-form content", icon: "💼", color: "from-blue-600 to-blue-600" },
                      { id: "twitter", name: "Twitter/X", desc: "Short, engaging tweets", icon: "🐦", color: "from-sky-500 to-sky-500" },
                    ].map((platform) => (
                      <div
                        key={platform.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform.id])
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform.id))
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-lg text-white bg-gradient-to-r ${platform.color}`}>
                            {platform.icon}
                          </div>
                          <div>
                            <label htmlFor={platform.id} className="font-medium cursor-pointer text-gray-900">
                              {platform.name}
                            </label>
                            <p className="text-sm text-gray-600">{platform.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!formData.Product_name || !formData.Company_name || !formData.Description || !formData.Post_description || !formData.Price || !formData.Features || isGenerating}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed h-12 rounded-md font-medium flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Posts...
                    </>
                  ) : (
                    <>
                      ✨ Generate Posts
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Generate posts for preview
  const generatedPosts = generatePostsForPlatforms()
  const currentPost = generatedPosts[selectedVariation] || generatedPosts[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep("input")}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                ← Back to Input
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Generated Posts</h1>
                <p className="text-sm text-gray-600">
                  Product name: {formData.Product_name} • Company name: {formData.Company_name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  "🔄"
                )}
                Regenerate
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                💾 Save to Library
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Platform Tabs */}
          <div className="flex gap-2 mb-6">
            {selectedPlatforms.map((platform, index) => {
              const platformData = {
                instagram: { icon: "📷", color: "from-purple-500 to-pink-500" },
                linkedin: { icon: "💼", color: "from-blue-600 to-blue-600" },
                twitter: { icon: "🐦", color: "from-sky-500 to-sky-500" }
              }[platform] || { icon: "📱", color: "from-gray-500 to-gray-500" }
              
              const isActive = selectedVariation === index
              return (
                <button
                  key={platform}
                  onClick={() => setSelectedVariation(index)}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    isActive 
                      ? `bg-gradient-to-r ${platformData.color} text-white` 
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {platformData.icon}
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Platform Preview</h2>
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-0">
                  {currentPost && (
                    <div className="space-y-4">
                      {/* Instagram Preview */}
                      {currentPost.platform === "instagram" && (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md mx-auto">
                          <div className="flex items-center p-3 border-b">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">📷</div>
                            <span className="ml-3 font-semibold text-gray-900">your_brand</span>
                          </div>
                          {postDetails.Image && (
                            <img
                              src={postDetails.Image}
                              alt="Post preview"
                              className="w-full aspect-square object-cover"
                            />
                          )}
                          <div className="p-3">
                            <div className="flex items-center gap-4 mb-3 text-gray-600">
                              <span className="text-xl">❤️</span>
                              <span className="text-xl">💬</span>
                              <span className="text-xl">📤</span>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">{postDetails.Caption}</p>
                            <p className="text-sm text-blue-600 mb-2">{postDetails.Hashtag}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>{currentPost.engagement.likes} likes</span>
                              <span>{currentPost.engagement.comments} comments</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* LinkedIn Preview */}
                      {currentPost.platform === "linkedin" && (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-lg mx-auto">
                          <div className="flex items-center p-4 border-b">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">💼</div>
                            <div className="ml-3">
                              <div className="font-semibold text-gray-900">{formData.Company_name}</div>
                              <div className="text-sm text-gray-500">2h • 🌍</div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-900 mb-4">{postDetails.Caption}</p>
                            {postDetails.Image && (
                              <img
                                src={postDetails.Image}
                                alt="Post preview"
                                className="w-full h-48 object-cover rounded mb-4"
                              />
                            )}
                            <div className="flex items-center gap-6 pt-3 border-t text-sm text-gray-500">
                              <span>👍 {currentPost.engagement.likes}</span>
                              <span>💬 {currentPost.engagement.comments}</span>
                              <span>🔄 {currentPost.engagement.shares}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Twitter Preview */}
                      {currentPost.platform === "twitter" && (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-lg mx-auto">
                          <div className="flex p-4">
                            <div className="w-10 h-10 bg-sky-500 rounded-full mr-3 flex items-center justify-center text-white">🐦</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900">{formData.Company_name}</span>
                                <span className="text-gray-500">@{formData.Company_name.toLowerCase().replace(/\s/g, '')}</span>
                                <span className="text-gray-500">• 2h</span>
                              </div>
                              <p className="text-gray-900 mb-3">{postDetails.Caption}</p>
                              <p className="text-blue-500 mb-3">{postDetails.Hashtag}</p>
                              {postDetails.Image && (
                                <img
                                  src={postDetails.Image}
                                  alt="Post preview"
                                  className="w-full h-48 object-cover rounded-lg mb-3"
                                />
                              )}
                              <div className="flex items-center gap-6 text-gray-500">
                                <span className="flex items-center gap-1">
                                  💬 {currentPost.engagement.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                  🔄 {currentPost.engagement.shares}
                                </span>
                                <span className="flex items-center gap-1">
                                  ❤️ {currentPost.engagement.likes}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}