"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  index: string;
  hasPhoto: boolean;
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      className="glass-card overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
        {member.hasPhoto ? (
          <Image
            src={member.image}
            alt={`Portrait of ${member.name}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02]">
            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-3">
              <span className="font-mono text-2xl text-white/15">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <span className="text-xs text-white/20 font-mono">Photo pending verification</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Metadata on hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="font-mono text-[9px] text-[#FF9040]/50 tracking-widest uppercase">
            TEAM / {member.index}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white/90 mb-1">{member.name}</h3>
        <p className="text-sm text-[#FF9040]/60">{member.role}</p>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        const members: TeamMember[] = (Array.isArray(data) ? data : []).map(
          (m: any, i: number) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            image: m.image || "",
            index: String(i + 1).padStart(2, "0"),
            hasPhoto: Boolean(m.image && m.image.trim() !== ""),
          })
        );
        setTeam(members);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to hardcoded defaults if API fails
        setTeam([
          {
            id: "1",
            name: "Dr Anandhi",
            role: "Founder & CEO",
            image: "/dr-anandhi.png",
            index: "01",
            hasPhoto: true,
          },
          {
            id: "2",
            name: "Dr Anasuya Devi",
            role: "Chief Technology Officer",
            image: "/dr-anasuya-devi.png",
            index: "02",
            hasPhoto: true,
          },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="team" className="relative py-24 md:py-32" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-5" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/3 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="font-mono text-[10px] text-[#FF9040]/70 tracking-widest uppercase">
              Our People
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            The People Behind
            <br />
            <span className="bg-gradient-to-r from-[#FF9040] to-[#FF9040] bg-clip-text text-transparent">
              the Technology
            </span>
          </h2>
        </motion.div>

        {/* Team grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#FF9040]/30 border-t-[#FF9040] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {team.map((member, i) => (
              <TeamCard key={member.id || i} member={member} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
