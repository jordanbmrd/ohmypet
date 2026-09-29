import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Themes } from "@/components/sections/Themes";
import { Products } from "@/components/sections/Products";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <HowItWorks />
      <Themes />
      <Products />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
