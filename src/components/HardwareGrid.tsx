"use client";

import { Activity, Compass, Cpu, Bluetooth, Brain, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const hardwareItems = [
  {
    title: "5 flex sensors",
    description: "One sensor per finger detecting bend angle and resistance changes",
    meta: "Resistance range: 10kΩ – 50kΩ",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    title: "6-axis IMU",
    description: "Accelerometer and gyroscope capture hand orientation and dynamic motion",
    meta: "Sample rate: 50 Hz",
    icon: <Compass className="w-5 h-5" />,
  },
  {
    title: "XIAO nRF52840",
    description: "Ultra-compact main controller with built-in Bluetooth 5.0 and ARM Cortex-M4",
    meta: "64 MHz, 1 MB flash, 256 KB RAM",
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    title: "Bluetooth LE",
    description: "Low-energy wireless transmission to paired devices with minimal power consumption",
    meta: "Range: up to 30 meters",
    icon: <Bluetooth className="w-5 h-5" />,
  },
  {
    title: "ML inference",
    description: "Edge-optimized neural network classifies gestures using statistical feature extraction",
    meta: "Inference time: ~30 ms",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    title: "Voice output",
    description: "Text-to-speech synthesis converts recognized gestures into audible words",
    meta: "Web Speech API / espeak",
    icon: <Volume2 className="w-5 h-5" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HardwareGrid() {
  return (
    <section id="hardware" className="py-20 md:py-32 bg-bg-secondary">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Hardware specifications
          </h2>
          <p className="text-lg text-text-secondary">
            Built with off-the-shelf components for accessibility and hackability.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {hardwareItems.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <h4 className="text-base font-semibold text-text-primary">
                  {item.title}
                </h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="h-px w-full bg-border mb-4" />
              <p className="text-xs text-text-muted font-mono tracking-tight">
                {item.meta}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
