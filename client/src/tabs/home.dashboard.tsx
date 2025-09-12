import CircularGallery from "@/components/CircularGallery";
import { FlipWords } from "@/components/ui/flip-words";

export const Home = () => {
    const words = ["Social media posts", "Ads", "Email drafts", "Target audience"];
    return <div className="z-10">
        <div className="mt-10 flex justify-center text-5xl font-bold">   
            We help you create and get
            <FlipWords words={words}/> 
        </div>  

        <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
        </div> 
    </div>
}