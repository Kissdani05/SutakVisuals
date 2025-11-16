import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Script from "next/script";

export default function Home() {
  return (
    <div>
      <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SutakVisuals",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://sutakvisuals.hu",
          logo: (process.env.NEXT_PUBLIC_SITE_URL || "https://sutakvisuals.hu") + "/images/onedaye30.webp",
          sameAs: ["https://www.instagram.com/sutakvisuals"],
        })}
      </Script>
      <Script id="ld-site" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "SutakVisuals",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://sutakvisuals.hu",
          potentialAction: {
            "@type": "SearchAction",
            target: (process.env.NEXT_PUBLIC_SITE_URL || "https://sutakvisuals.hu") + "/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        })}
      </Script>
      <Navbar />
      <Hero />
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
