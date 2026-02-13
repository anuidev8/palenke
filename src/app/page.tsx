import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Objective from "@/components/Objective";
import Governance from "@/components/Governance";
import MVP from "@/components/MVP";
import SIG from "@/components/SIG";
import Phase2 from "@/components/Phase2";
import Technical from "@/components/Technical";
import CoDesign from "@/components/CoDesign";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8EA]">
      <Navbar />
      <Hero />
      <Objective />
      <Governance />
      <MVP />
      <SIG />
      <Phase2 />
      <Technical />
      <CoDesign />
      <Footer />
    </main>
  );
}
