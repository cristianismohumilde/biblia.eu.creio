"use client";

export function FlagBR({ className = "" }) {
  return (
    <img 
      src="https://flagcdn.com/br.svg" 
      alt="Brasil" 
      className={className} 
      width="20" 
      height="15" 
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '2px' }}
    />
  );
}

export function FlagUS({ className = "" }) {
  return (
    <img 
      src="https://flagcdn.com/us.svg" 
      alt="USA" 
      className={className} 
      width="20" 
      height="15" 
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '2px' }}
    />
  );
}
