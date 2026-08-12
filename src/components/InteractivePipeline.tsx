"use client";

import { useState } from "react";
import { Hand, Activity, Cpu, Bluetooth, Brain, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, label: "Movement", icon: <Hand className="w-5 h-5" />, desc: "Hand bends and moves" },
  { id: 2, label: "Sensors", icon: <Activity className="w-5 h-5" />, desc: "Flex + IMU data capture" },
  { id: 3, label: "MCU", icon: <Cpu className="w-5 h-5" />, desc: "XIAO nRF52840 processes" },
  { id: 4, label: "BLE", icon: <Bluetooth className="w-5 h-5" />, desc: "Wireless transmission" },
  { id: 5, label: "Inference", icon: <Brain className="w-5 h-5" />, desc: "ML classifies gesture" },
  { id: 6, label: "Output", icon: <Volume2 className="w-5 h-5" />, desc: "Text & Speech generation" },
];

export default function InteractivePipeline() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="pipeline" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            How it works
          </h2>
          <p className="text-lg text-text-secondary">
            A seamless flow from physical movement to digital speech in under 300 milliseconds.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Animated data flow line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-bg-secondary -translate-y-1/2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent/50 w-1/4 rounded-full"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 relative z-10">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col lg:flex-row items-center">
                
                {/* Step Node */}
                <div 
                  className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-xl transition-all duration-300 cursor-default ${
                    hoveredStep === step.id 
                      ? "bg-bg-secondary border-accent border-2 shadow-md scale-105" 
                      : hoveredStep !== null 
                        ? "bg-white border-border border opacity-50" 
                        : "bg-white border-border border hover:border-accent/50"
                  }`}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    hoveredStep === step.id ? "bg-accent text-white" : "bg-bg-secondary text-primary"
                  }`}>
                    {step.icon}
                  </div>
                  <span className="text-sm font-semibold text-text-primary">{step.label}</span>
                  
                  {/* Tooltip */}
                  <div className={`absolute -bottom-12 w-40 text-center transition-opacity duration-200 ${
                    hoveredStep === step.id ? "opacity-100" : "opacity-0"
                  }`}>
                    <span className="text-xs text-text-secondary bg-white shadow-sm border border-border py-1 px-2 rounded-md">
                      {step.desc}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex w-8 items-center justify-center text-border">
                    →
                  </div>
                )}
                
                {/* Connector Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden h-8 flex items-center justify-center text-border">
                    ↓
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
