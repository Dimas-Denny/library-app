import HeroSlider from "@/components/sections/HeroSlider";
import CategorySection from "@/components/sections/CategorySection";
import RecommendationSection from "@/components/sections/RecommendationSection";
import PopularAuthors from "@/components/sections/PopularAuthors";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
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
    </div>
  );
}
