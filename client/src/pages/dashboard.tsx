// import { StaggeredSidebar } from "@/components/staggered-sidebar"

import { Navbar } from "@/components/navbar"
import { SideBar } from "@/components/sidebar-menu"

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <SideBar/>    
      <div>hiii</div>
    </div>
  )
}
