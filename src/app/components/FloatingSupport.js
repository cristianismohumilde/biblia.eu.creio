"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingSupport({ lang, t }) {
  const pathname = usePathname();
  
  // Check if we are on the homepage (e.g., "/pt", "/en", or just "/")
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/` || pathname === "/";

  if (isHomePage) return null;

  return (
    <Link 
      href={`/${lang}/#apoie`}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#ef4444',
        color: '#fff',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
        zIndex: 1000,
        textDecoration: 'none',
        fontSize: '24px',
        cursor: 'pointer',
      }}
      title={t.supportTitle}
      className="heart-beat"
    >
      ❤️
    </Link>
  );
}
