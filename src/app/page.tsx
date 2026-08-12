import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import InteractivePipeline from "@/components/InteractivePipeline";
import HardwareGrid from "@/components/HardwareGrid";
import SimulatorWidget from "@/components/SimulatorWidget";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main id="main-content" className="flex-grow">
        <Hero />
        
        {/* Problem Section */}
        <section id="problem" className="py-20 md:py-32 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Communication should not depend on spoken language
              </h2>
              <p className="text-lg text-text-secondary">
                There are many situations where voice interfaces or screens are impractical or inaccessible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-bg-secondary p-8 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
                  <span className="text-xl" role="img" aria-label="Globe">🌍</span>
                </div>
                <h4 className="text-lg font-semibold text-text-primary mb-3">70 million people worldwide</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  use sign language as their primary form of communication.
                </p>
              </div>
              <div className="bg-bg-secondary p-8 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
                  <span className="text-xl" role="img" aria-label="Muted">🔇</span>
                </div>
                <h4 className="text-lg font-semibold text-text-primary mb-3">Voice interfaces exclude many</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Noisy environments, speech impairments, and privacy concerns make voice control impractical.
                </p>
              </div>
              <div className="bg-bg-secondary p-8 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
                  <span className="text-xl" role="img" aria-label="Users">👥</span>
                </div>
                <h4 className="text-lg font-semibold text-text-primary mb-3">Bridging the communication gap</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Translating gestures into digital text and speech creates inclusive, seamless interaction.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <a href="#pipeline" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors">
                Learn how it works <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        <FeatureGrid />
        <InteractivePipeline />
        <HardwareGrid />
        <SimulatorWidget />

        {/* CTA Section */}
        <section className="bg-bg-dark text-text-on-dark py-24 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Help us build the future</h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              AI Glove is open source. Contribute hardware designs, train new gestures, or fork the project.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://github.com/abdulquader057-dev/Ai-glove-"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-100 text-primary px-8 py-4 rounded-md font-medium transition-colors"
              >
                Contribute on GitHub
              </a>
              <a 
                href="#"
                className="bg-transparent border border-white hover:bg-white/10 text-white px-8 py-4 rounded-md font-medium transition-colors"
              >
                Join our Discord
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
