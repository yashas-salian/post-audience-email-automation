import type { tabs } from '@/pages/dashboard';
import {  StaggeredSidebar } from './StaggeredMenu';
import { useRef } from 'react';


export const SideBar = ({setTab}:{setTab: React.Dispatch<React.SetStateAction<tabs>>}) =>{
const menuItems = [
  { label: 'Campaign', ariaLabel: 'Home', link: '#' },
  { label: 'Social media post', ariaLabel: 'Social media post', link: '#' },
  { label: 'Ads', ariaLabel: 'Ads', link: '#' },
  { label: 'Emails', ariaLabel: 'Ads', link: '#' },
  { label: 'Target Audience', ariaLabel: 'Target Audience', link: '#' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];
const handleScroll = () => {
    // Scroll to the div when button is clicked
    const targetRef = useRef<HTMLDivElement>(null);
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

return <header className="flex items-center justify-between p-6">
        <div className='border border-black rounded-full'> 
            {/* <img src={logo} 
            width={50}
            height={50}
            className="text-white text-xl font-bold"/> */}
        </div>
        {/* Default sidebar with built-in trigger */}
        <StaggeredSidebar
          items={menuItems}
          socialItems={socialItems}
          accentColor="#F48120"
          position="right"
          displayItemNumbering={true}
          displaySocials={true}
          setTab={setTab}
        />
      </header>
}