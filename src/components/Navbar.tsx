"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {isHome ? (
          <Link href="/" className="navbar__logo" aria-label="Flighko home">
            <img src="/flighko-icon.png" alt="Flighko" width={28} height={28} style={{ objectFit: "contain", borderRadius: 6 }} />
            Flighko
          </Link>
        ) : (
          <a href="/" className="navbar__logo" aria-label="Flighko home">
            <img src="/flighko-icon.png" alt="Flighko" width={28} height={28} style={{ objectFit: "contain", borderRadius: 6 }} />
            Flighko
          </a>
        )}
        <button className="navbar__toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? "✕" : "☰"}
        </button>
        <ul className={`navbar__links${open ? " open" : ""}`}>
          <li><Link href="/flight-routes/">Routes</Link></li>
          <li><Link href="/destinations/">Destinations</Link></li>
          <li><Link href="/blog/">Blog</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
          {!isHome && (
            <li className="navbar__cta"><a href="/" className="navbar__btn">Search Flights</a></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
