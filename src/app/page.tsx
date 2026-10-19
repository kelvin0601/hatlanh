import { HeroSection } from "@/components/sections/HeroSection";
import { IngredientsSection } from "@/components/sections/IngredientsSection";
import { StorySection } from "@/components/sections/StorySection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { MindfulSection } from "@/components/sections/MindfulSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <IngredientsSection />
      <StorySection />
      <ProductsSection />
      <MindfulSection />
      <ValuesSection />
      <TestimonialsSection />
      <JournalSection />
      <NewsletterSection />
    </>
  );
}
