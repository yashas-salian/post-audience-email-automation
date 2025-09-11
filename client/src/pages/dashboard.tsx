// import { StaggeredSidebar } from "@/components/staggered-sidebar"

import { Navbar } from "@/components/navbar"
import { SideBar } from "@/components/sidebar-menu"
import { Ads } from "@/tabs/ads.dashboard"
import { AudienceProfile } from "@/tabs/audience-profile.dashboard"
import { Home } from "@/tabs/home.dashboard"
import { Post } from "@/tabs/post.dashboard"
import { useState } from "react"

export type tabs =  "Home" | "Social media post" | "Ads" | "Target Audience"
export const Dashboard = () => {
  const [tab ,setTab] = useState<tabs>("Home")
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <SideBar/>   
      {
        tab == "Home" && <Home/>
      } 
      {
        tab == "Social media post" && <Post/>
      } 
      {
        tab == "Ads" && <Ads/>
      } 
      {
        tab == "Target Audience" && <AudienceProfile/>
      } 
      {/* <div>hiii</div> */}
    </div>
  )
}
