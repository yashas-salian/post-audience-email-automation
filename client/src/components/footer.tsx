 import {Link} from "react-router-dom"
 import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
// import logo from "../images/WeE_logo.png"

 const scrollToTop = (e:any) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",   
    });
  };
export const Footer = () =>{
    return <div className="bg-[#F48120] z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-6 md:py-8 w-full text-white border-t-2 border-t-white">
            {/* Home Section */}
            <div className="flex flex-col items-center md:items-start">
            <b className="text-2xl mb-4 text-white  ">Quick links</b>
              <ul className="text-white space-y-2">
                <li className="font-semibold transition-all duration-400 hover:scale-105"><Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop(e);
                }}
                className="mb-4"
              >
                <span className="text-white">Go to top</span>
              </Link></li>
                <li className="font-semibold transition-all duration-100 hover:scale-105"><Link to="/dashboard"><span className="text-white">Terms & Privacy</span></Link></li>
                <li className="font-semibold transition-all duration-100 hover:scale-105"><Link to="/dashboard"><span className="text-white">Docs</span></Link></li>
                <li className="font-semibold transition-all duration-100 hover:scale-105"><Link to="/dashboard"><span className="text-white">About us</span></Link></li>
                <li className="font-semibold transition-all duration-100 hover:scale-105"><Link to="/dashboard"><span className="text-white">Contact us</span></Link></li>
              </ul>
              
            </div>
    
    
              {/* Our team section */}
            <div className="flex flex-col items-center md:items-center">
              <b className="text-2xl mt-4 text-white mt-8 mb-4">Social media</b>
              <div className="text-white grid grid-cols-5 gap-x-4"> 
                <div className="transition-all duration-100 hover:scale-120"><Link to="https://www.instagram.com/yashassalian1/"><Instagram className="text-white"/></Link></div>
                <div className="transition-all duration-100 hover:scale-120"><Link to="https://www.instagram.com/yashassalian1/"><Facebook className="text-white"/></Link></div>
                <div className="transition-all duration-100 hover:scale-120"><Link to="https://www.youtube.com/@yashassalian191"><Youtube className="text-white"/></Link></div>
                <div className="transition-all duration-100 hover:scale-120"><Link to="https://www.linkedin.com/in/yashas-salian-69539228b/"><Linkedin className="text-white"/></Link></div>
                <div className="transition-all duration-100 hover:scale-120"><Link to="https://x.com/salian_yashas"><X className="text-white"/></Link></div>
              </div>
            </div>
    
            {/* About Us Section */}
            <div className="flex flex-col items-center md:items-end">
              <img src="" alt="Company logo" className="w-40 h-40"></img>
            </div>          
          </div>
}