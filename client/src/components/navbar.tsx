import CardNav, { type CardNavItem } from './CardNav'
import logo from '../../public/Brainstorming Energy Logo.png';

export const Navbar = () => {
  const items: CardNavItem[] = [
    {
      label: "About",
      bgColor: "#F48120",
      textColor: "#fff",
      links: [
        { label: "Company", href:"#", ariaLabel: "About Company" },
        { label: "Careers", href:"#", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#FAAD3F",
      textColor: "#fff",
      links: [
        { label: "Featured", href:"#", ariaLabel: "Featured Projects" },
        { label: "Case Studies", href:"#", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#404041", 
      textColor: "#fff",
      links: [
        { label: "Email", href:"#", ariaLabel: "Email us" },
        { label: "Twitter", href:"#", ariaLabel: "Twitter" },
        { label: "LinkedIn", href:"#", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
    <CardNav
      logo={logo}
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#FAAD3F"
      buttonBgColor="#FAAD3F"  
    //   "#F48120", "#FAAD3F", "#404041"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
};