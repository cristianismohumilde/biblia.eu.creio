"use client";

export function FlagBR({ className = "" }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 720 504" 
      width="20" 
      height="14"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <rect width="720" height="504" fill="#009b3a"/>
      <path fill="#fedf00" d="M360 36L684 252 360 468 36 252z"/>
      <circle cx="360" cy="252" r="126" fill="#002776"/>
      <path fill="#fff" d="M250 220a170 170 0 0 0 220 70 175 175 0 0 1-220-70z"/>
    </svg>
  );
}

export function FlagUS({ className = "" }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 741 390" 
      width="20" 
      height="14"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <rect width="741" height="390" fill="#bf0a30"/>
      <path fill="#fff" d="M0 30h741M0 90h741M0 150h741M0 210h741M0 270h741M0 330h741"/>
      <rect width="296" height="210" fill="#002868"/>
      <g fill="#fff">
        <circle cx="25" cy="25" r="3"/><circle cx="55" cy="25" r="3"/><circle cx="85" cy="25" r="3"/><circle cx="115" cy="25" r="3"/><circle cx="145" cy="25" r="3"/>
        <circle cx="40" cy="45" r="3"/><circle cx="70" cy="45" r="3"/><circle cx="100" cy="45" r="3"/><circle cx="130" cy="45" r="3"/>
        <circle cx="25" cy="65" r="3"/><circle cx="55" cy="65" r="3"/><circle cx="85" cy="65" r="3"/><circle cx="115" cy="65" r="3"/><circle cx="145" cy="65" r="3"/>
        <circle cx="40" cy="85" r="3"/><circle cx="70" cy="85" r="3"/><circle cx="100" cy="85" r="3"/><circle cx="130" cy="85" r="3"/>
        <circle cx="25" cy="105" r="3"/><circle cx="55" cy="105" r="3"/><circle cx="85" cy="105" r="3"/><circle cx="115" cy="105" r="3"/><circle cx="145" cy="105" r="3"/>
        <circle cx="40" cy="125" r="3"/><circle cx="70" cy="125" r="3"/><circle cx="100" cy="125" r="3"/><circle cx="130" cy="125" r="3"/>
        <circle cx="25" cy="145" r="3"/><circle cx="55" cy="145" r="3"/><circle cx="85" cy="145" r="3"/><circle cx="115" cy="145" r="3"/><circle cx="145" cy="145" r="3"/>
        <circle cx="40" cy="165" r="3"/><circle cx="70" cy="165" r="3"/><circle cx="100" cy="165" r="3"/><circle cx="130" cy="165" r="3"/>
        <circle cx="25" cy="185" r="3"/><circle cx="55" cy="185" r="3"/><circle cx="85" cy="185" r="3"/><circle cx="115" cy="185" r="3"/><circle cx="145" cy="185" r="3"/>
      </g>
    </svg>
  );
}
