import {  StaggeredSidebar } from './StaggeredMenu';
import logo from "../../public/Brainstorming Energy Logo.png"


export const SideBar = () =>{
const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

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
        />
      </header>
}