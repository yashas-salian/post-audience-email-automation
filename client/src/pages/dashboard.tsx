// import { StaggeredSidebar } from "@/components/staggered-sidebar"

import { Navbar } from "@/components/navbar"
import { SideBar } from "@/components/sidebar-menu"
import { Ads } from "@/tabs/ads.dashboard"
import { AudienceProfile } from "@/tabs/audience-profile.dashboard"
import { Home } from "@/tabs/home.dashboard"
import { Post } from "@/tabs/post.dashboard"
import { useState } from "react"
import Shuffle from "@/components/Shuffle"

export type tabs =  "Home" | "Social media post" | "Ads" | "Target Audience"
export const Dashboard = () => {
  const [tab ,setTab] = useState<tabs>("Home")
  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="grid grid-cols-3 gap-x-4">
  <div className="col-span-1 mt-10 ml-4">
    <Shuffle
      text="Safiya"
      shuffleDirection="right"
      duration={0.35}
      animationMode="evenodd"
      shuffleTimes={1}
      ease="power3.out"
      stagger={0.03}
      threshold={0.1}
      triggerOnce={true}
      triggerOnHover={true}
      respectReducedMotion={true}
      colorFrom="#404041"
      colorTo="#F48120"
      style={{fontSize: "3rem"}}
    />
  </div>
  <div className="col-span-1"> {/* Fixed: was "cols-span-1" */}
    <Navbar />
  </div>
  <div className="col-span-1"> {/* Removed absolute positioning */}
    <SideBar setTab={setTab}/>  
  </div>
</div>
      {/* <img src={background} className="absolute inset-0  object-cover z-0"></img>  */}
      <div className="relative z-10">
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
        </div> 

      {/* <div>hiii</div> */}
    </div>
  )
}
