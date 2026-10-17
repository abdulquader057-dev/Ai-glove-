// ATMOS Executive Engineering Dossier - Team Syntropy Section
// Refined 4-column dossier grid with subtle top border dividers and glowing accent badges on hover

'use client';

import React from 'react';
import TeamSyntropyLogo from '@/components/brand/TeamSyntropyLogo';
import { ArrowUpRight } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    index: '01',
    name: 'MOHMMED NAZEER AHMED',
    title: 'Team Lead & Hardware Architect',
    focus: 'Embedded system design, PCB layout, sensor power management, and physical glove fabrication.',
    accent: '#00F2A6',
    tag: 'EMBEDDED HARDWARE',
  },
  {
    index: '02',
    name: 'ABDUL QUADER',
    title: 'Lead Software Engineer & Hardware Bridge',
    focus: 'Platform software architecture, Serial-to-WebSocket hardware telemetry bridge, live studio interface, and Firebase cloud sync.',
    accent: '#00D2FF',
    tag: 'FULL-STACK PLATFORM',
  },
  {
    index: '03',
    name: 'SOHA ALAM KHAN',
    title: 'Machine Learning & Gesture Engineer',
    focus: 'Kinetic gesture dataset training, ML model optimization, dynamic gesture classification, and sensor-to-speech accuracy validation.',
    accent: '#A855F7',
    tag: 'EDGE INTELLIGENCE',
  },
  {
    index: '04',
    name: 'MUHAMMAD FURQAN',
    title: '3D Design & Product Research',
    focus: '3D CAD modeling of the glove enclosure, ergonomic kinematic simulation, and assistive feature innovation.',
    accent: '#F59E0B',
    tag: '3D ERGONOMICS',
  },
];

export const AtmosTeamDossier: React.FC = () => {
  return (
    <section id="team" className="relative z-30 py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-white/5">
      {/* Header with Team Syntropy Logo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="space-y-4 max-w-2xl text-left">
          <div className="flex items-center gap-3">
            <TeamSyntropyLogo width={180} height={38} />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#00F2A6] text-xs font-mono font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6] animate-pulse" />
            <span>03 // EXECUTIVE ENGINEERING DOSSIER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
            MEET TEAM SYNTROPY.
          </h2>
          <p className="text-sm sm:text-base text-[#7E8B95] font-sans leading-relaxed">
            The multidisciplinary engineering unit responsible for SIGNOVA's physical sensor fabrication, real-time serial telemetry, and edge machine learning classification.
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end font-mono text-xs text-[#7E8B95]">
          <span className="text-[#F6F6F8] font-bold">ASSISTIVE KINEMATICS LAB</span>
          <span>EST. 2026 // HYDERABAD, INDIA</span>
        </div>
      </div>

      {/* 4-Column Refined Dossier Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.index}
            className="group relative p-7 rounded-3xl bg-[#0A0D12]/60 border border-white/10 hover:border-white/30 transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between backdrop-blur-xl overflow-hidden text-left"
          >
            {/* Top Border Glowing Highlight */}
            <div
              style={{ backgroundColor: member.accent }}
              className="absolute top-0 left-0 right-0 h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_12px_currentColor]"
            />

            <div>
              {/* Member Index & Badge */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
                <span className="font-mono text-sm font-bold text-[#7E8B95] group-hover:text-[#F6F6F8] transition-colors">
                  {member.index} //
                </span>
                <span
                  style={{ color: member.accent }}
                  className="font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5"
                >
                  {member.tag}
                </span>
              </div>

              {/* Name & Title */}
              <h3 className="font-space font-bold text-lg sm:text-xl text-[#F6F6F8] group-hover:text-white transition-colors leading-snug">
                {member.name}
              </h3>
              <div
                style={{ color: member.accent }}
                className="font-mono text-xs font-semibold mt-2 tracking-wide"
              >
                {member.title}
              </div>

              {/* Focus Summary */}
              <p className="font-sans text-xs text-[#7E8B95] mt-4 leading-relaxed">
                {member.focus}
              </p>
            </div>

            {/* Bottom Dossier Marker */}
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#7E8B95]">
              <span>ACTIVE ARCHITECT</span>
              <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                ↗
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AtmosTeamDossier;
