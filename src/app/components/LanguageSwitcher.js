"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FlagBR, FlagUS } from "./FlagIcon";

function buildLangHref(pathname, search, hash, targetLang) {
  const segments = (pathname || "/").split("/").filter(Boolean);
  const first = segments[0];

  if (first === "pt" || first === "en") {
    segments[0] = targetLang;
  } else {
    segments.unshift(targetLang);
  }

  const path = `/${segments.join("/")}/`;
  const query = search ? `?${search}` : "";

  return `${path}${query}${hash}`;
}

export default function LanguageSwitcher({ lang }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPathname, setCurrentPathname] = useState(pathname || "/");
  const [hash, setHash] = useState("");

  useEffect(() => {
    setCurrentPathname(window.location.pathname || pathname || "/");
    setHash(window.location.hash || "");

    const syncLocation = () => {
      setCurrentPathname(window.location.pathname || pathname || "/");
      setHash(window.location.hash || "");
    };

    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);

    return () => {
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, [pathname]);

  const search = searchParams.toString();

  const ptHref = useMemo(
    () => buildLangHref(currentPathname, search, hash, "pt"),
    [currentPathname, search, hash],
  );

  const enHref = useMemo(
    () => buildLangHref(currentPathname, search, hash, "en"),
    [currentPathname, search, hash],
  );

  return (
    <div className="lang-switcher">
      <Link href={ptHref} className={lang === "pt" ? "active" : ""} aria-label="Portugues">
        <FlagBR /> <span className="desktop-only">PT</span>
      </Link>
      <Link href={enHref} className={lang === "en" ? "active" : ""} aria-label="English">
        <FlagUS /> <span className="desktop-only">EN</span>
      </Link>
    </div>
  );
}
