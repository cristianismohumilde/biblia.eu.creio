"use client";

export default function RevokeConsentButton({ label }) {
  const handleRevoke = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cookie_consent");
      window.location.reload();
    }
  };

  return (
    <button
      id="btn-manage-cookies"
      className="support-cta"
      onClick={handleRevoke}
    >
      🍪 {label}
    </button>
  );
}
