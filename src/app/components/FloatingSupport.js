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
        backgroundColor: 'rgba(153, 27, 27, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#fff',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(153, 27, 27, 0.4)',
        zIndex: 2000,
        textDecoration: 'none',
        fontSize: '20px',
        cursor: 'pointer',
      }}
      title={t.supportTitle}
      className="heart-beat"
    >
      ❤️
    </Link>
  );
}
