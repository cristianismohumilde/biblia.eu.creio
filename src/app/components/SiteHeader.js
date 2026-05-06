"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({ lang, t, eyebrow, title, subtitle, links = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-brand">
        <p className="brand-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      <div className="header-actions">
        <LanguageSwitcher lang={lang} />
        <ThemeToggle t={t} />
        
        {links.length > 0 && (
          <button 
            className={`hamburger ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        )}
      </div>

      {links.length > 0 && (
        <nav className={`quick-nav ${isMenuOpen ? "mobile-open" : ""}`} aria-label="Navegação rápida">
          {links.map((link, i) => (
            <Link 
              key={i} 
              href={link.href} 
              className={link.className || ""}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
