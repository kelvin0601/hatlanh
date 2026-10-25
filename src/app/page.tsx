import { HeroSection } from "@/components/sections/HeroSection";
import { IngredientsSection } from "@/components/sections/IngredientsSection";
import { StorySection } from "@/components/sections/StorySection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { MindfulSection } from "@/components/sections/MindfulSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { getSitePageContent } from "@/lib/site-content-store";

export default async function Home() {
  const content = await getSitePageContent("home");
  return (
    <>
      <HeroSection content={content} />
      <IngredientsSection content={content} />
      <StorySection content={content} />
      <ProductsSection content={content} />
      <MindfulSection content={content} />
      <ValuesSection content={content} />
      <TestimonialsSection content={content} />
      <JournalSection content={content} />
      <NewsletterSection content={content} />
    </>
  );
}
