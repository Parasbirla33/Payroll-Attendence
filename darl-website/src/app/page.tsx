import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Industries } from "@/components/Industries";
import { Standards } from "@/components/Standards";
import { Credentials } from "@/components/Credentials";
import { Process } from "@/components/Process";
import { Infrastructure } from "@/components/Infrastructure";
import { QuoteSection } from "@/components/QuoteSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <Industries />
        <Standards />
        <Credentials />
        <Process />
        <Infrastructure />
        <QuoteSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
