"use client";

import { ArrowRight, FileText } from "lucide-react";
import dynamic from 'next/dynamic';

const AIGlove3D = dynamic(() => import("./AIGlove3D"), { 
  ssr: false,
  loading: () => <div className="w-full aspect-square md:h-[600px] flex items-center justify-center bg-bg-secondary rounded-2xl animate-pulse"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
});
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-bg-secondary">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            className="flex flex-col items-start text-left max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] font-semibold text-success uppercase tracking-wider">
                Open source hardware project
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 tracking-tight"
            >
              The future of hand communication
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-[480px]"
            >
              Turn gestures into words with AI. A wearable glove that recognizes hand movements and speaks for you in real-time.
            </motion.p>

            {/* CTA Group */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-md text-base font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Try live demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="https://github.com/abdulquader057-dev/Ai-glove-"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white hover:bg-bg-secondary border border-border text-text-primary px-8 py-4 rounded-md text-base font-medium transition-colors shadow-sm"
              >
                Read documentation
                <FileText className="w-4 h-4 text-text-muted" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Visualization */}
          <motion.div 
            className="w-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <AIGlove3D />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
