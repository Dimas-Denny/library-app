import Navbar from "./components/layout/Navbar";
import HeroSlider from "./components/layout/HeroSlider";
import CategorySection from "./components/layout/CategorySection";
import RecommendationSection from "./components/layout/RecommendationSection";
import PopularAuthors from "./components/layout/PopularAuthors";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main
        className="
          mx-auto w-full max-w-6xl flex-1
          px-4 md:px-16
          py-4 md:py-8
          space-y-8 md:space-y-12
        "
      >
        <HeroSlider />
        <CategorySection />
        <RecommendationSection />
        <PopularAuthors />
      </main>

      <Footer />
    </div>
  );
}
