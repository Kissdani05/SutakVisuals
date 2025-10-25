import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
