"use client";

import Link from "next/link";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Vision", href: "#vision" },
      { label: "Team", href: "#team" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "AI / ML", href: "#technology" },
      { label: "Robotics", href: "#technology" },
      { label: "Software", href: "#technology" },
      { label: "Advanced Computing", href: "#technology" },
    ],
  },
  {
    title: "Insights",
    links: [
      { label: "Blog & Articles", href: "/blog" },
      { label: "Research", href: "#research" },
      { label: "Newsletters", href: "/blog" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "anandhi@appliedaiml.com", href: "mailto:anandhi@appliedaiml.com" },
      { label: "+91 9742994849", href: "tel:+919742994849" },
      { label: "Bangalore, Karnataka", href: "#contact" },
    ],
  },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer className="relative bg-[#080808] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {columns.map((col, i) => (
            <div key={i}>
              <h3 className="font-mono text-[10px] tracking-widest uppercase mb-4 text-white/30">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-white/40 hover:text-white/70 transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-[11px] text-white/25 font-mono hover:text-white/40 transition-colors">
APPLIED SYSTEMS RESEARCH AND TECHNOLOGY (OPC) PRIVATE LIMITED
          </Link>
          <p className="text-[10px] text-white/15">
            © {new Date().getFullYear()} ASRT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
