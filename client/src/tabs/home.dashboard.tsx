import CircularGallery from "@/components/CircularGallery";
import { FlipWords } from "@/components/ui/flip-words";


export const Home = () => {
    const words = ["Social media posts", "Ads", "Email drafts", "Target audience"];

    return (
        <div className="z-10">
            {/* Hero Section */}
            <div className="mt-10 flex justify-center text-5xl font-bold">
                We help you create and get
                <FlipWords words={words} />
            </div>            
        </div>
    );
};