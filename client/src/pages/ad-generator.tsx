"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";

interface ProductDetails {
  productName: string;
  companyName: string;
  description: string;
  price: string;
  features: string;
  usp: string;
  postDescription: string;
  image?: File | null;
}

interface GeneratedAd {
  url: string;
}

export default function AdGen() {
  // const { toast } = useToast();
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    productName: "",
    companyName: "",
    description: "",
    price: "",
    features: "",
    usp: "",
    postDescription: "",
    image: null,
  });

  const [ads, setAds] = useState<GeneratedAd[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductDetails((prev) => ({ ...prev, image: file }));
  };

  const generateAds = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(productDetails).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value as any);
        }
      });

      const res = await axios.post('http://127.0.0.1:8787/generate-image/ad', { 
      productDetails: formData,
      type : "Ad"
    })

      // BE returns { data: "https://cloudinary.com/xyz.png" }
      if (res.data && typeof res.data.data === "string") {
        setAds((prev) => [...prev, { url: res.data.data }]);
        // toast({ title: "Success", description: "Ad generated successfully!" });
      } else {
        // toast({
        //   title: "Error",
        //   description: "Unexpected response from server.",
        //   variant: "destructive",
        // });
      }
    } catch (err) {
      // toast({
      //   title: "Error",
      //   description: "Failed to generate ad.",
      //   variant: "destructive",
      // });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ad Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="productName"
                value={productDetails.productName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input
                name="companyName"
                value={productDetails.companyName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={productDetails.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              value={productDetails.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Features</Label>
            <Textarea
              name="features"
              value={productDetails.features}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>USP</Label>
            <Textarea
              name="usp"
              value={productDetails.usp}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Post Description</Label>
            <Textarea
              name="postDescription"
              value={productDetails.postDescription}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Upload Product Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <Button onClick={generateAds} disabled={loading}>
            {loading ? "Generating..." : "Generate Ad"}
          </Button>
        </CardContent>
      </Card>

      {ads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Ad {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={ad.url}
                  alt={`Ad ${i + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
