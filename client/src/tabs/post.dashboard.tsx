import Loader from "@/components/loader"
import { ProductForm } from "@/components/productForm"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Download, Share2, RotateCcw, Palette, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"

export const Post = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [imgURL, setimgURL] = useState<null | string>(null)
    const [postLoading, setPostLoading] = useState<boolean>(false)
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(42)
    const [rating, setRating] = useState(0)
    const [showFilters, setShowFilters] = useState(false)
    const [imageHistory, setImageHistory] = useState<string[]>([])
    const [currentFilter, setCurrentFilter] = useState("none")

    console.log(imgURL)
    const handleLike = () => {
        setLiked(!liked)
        setLikes((prev) => (liked ? prev - 1 : prev + 1))
    }

    const handleDownload = () => {
        if (imgURL) {
            const link = document.createElement("a")
            link.href = imgURL
            link.download = "generated-image.png"
            link.click()
        }
    }

    const handleShare = async () => {
        if (navigator.share && imgURL) {
            try {
                await navigator.share({
                    title: "Check out this generated image!",
                    url: imgURL,
                })
            } catch (err) {
                console.log("Error sharing:", err)
            }
        }
    }

    const handleRegenerate = () => {
        if (imgURL) {
            setImageHistory((prev) => [...prev, imgURL])
        }
        setimgURL(null)
        setCurrentFilter("none")
    }

    const applyFilter = (filter: string) => {
        setCurrentFilter(filter)
    }

    const handleRating = (newRating: number) => {
        setRating(newRating)
    }

    const filters = [
        { name: "none", label: "Original", class: "" },
        { name: "sepia", label: "Sepia", class: "sepia" },
        { name: "grayscale", label: "B&W", class: "grayscale" },
        { name: "blur", label: "Blur", class: "blur-sm" },
        { name: "brightness", label: "Bright", class: "brightness-125" },
        { name: "contrast", label: "Contrast", class: "contrast-125" },
    ]

    return <div>
        {
            postLoading && (
                <div className="w-full h-full absolute top-100 left-1/2">
                    <Loader />
                </div>
            )
        }
        {
            !postLoading && imgURL != null && (
                <div className="space-y-6">
                    {/* Main Image Display */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-center mb-4">
                                <div className="relative group">
                                    <img
                                        src={imgURL || "/placeholder.svg"}
                                        width={500}
                                        height={500}
                                        alt="Generated product"
                                        className={cn(
                                            "rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl",
                                            currentFilter !== "none" && filters.find((f) => f.name === currentFilter)?.class,
                                        )}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                                </div>
                            </div>

                            {/* Image Stats */}
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {likes} likes
                                </Badge>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {rating > 0 ? `${rating}/5` : "Not rated"}
                                </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                <Button
                                    variant={liked ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleLike}
                                    className="flex items-center gap-2"
                                >
                                    <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                                    {liked ? "Liked" : "Like"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleDownload}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleShare}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleRegenerate}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    New Image
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                                    <Palette className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </div>

                            {/* Rating System */}
                            <div className="flex justify-center items-center gap-2 mb-4">
                                <span className="text-sm text-muted-foreground">Rate this image:</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRating(star)}
                                            className="transition-colors hover:text-yellow-500"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-4 h-4",
                                                    star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground",
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Options */}
                            {showFilters && (
                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-medium mb-3 text-center">Apply Filters</h3>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {filters.map((filter) => (
                                            <Button
                                                key={filter.name}
                                                variant={currentFilter === filter.name ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => applyFilter(filter.name)}
                                            >
                                                {filter.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Image History */}
                    {imageHistory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Previous Generations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imageHistory.slice(-8).map((historyImg, index) => (
                                        <div key={index} className="relative group cursor-pointer" onClick={() => setimgURL(historyImg)}>
                                            <img
                                                src={historyImg || "/placeholder.svg"}
                                                alt={`Previous generation ${index + 1}`}
                                                className="w-full aspect-square object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                                    Use This
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )
        }
        {
            !postLoading && imgURL == null && (
                <div>
                    <div className="mt-10 ">
                        <ProductForm setPostLoading={setPostLoading} setimgURL={setimgURL} />
                    </div>
                </div>
            )
        }
    </div>
}