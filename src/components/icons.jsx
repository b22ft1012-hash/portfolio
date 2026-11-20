/* Бүх icon-уудыг SVG-ээр өөрөө зурсан (гадны icon сан ашиглаагүй) */

export const AppIcon = {
  about: (
    <svg viewBox="0 0 40 40">
      <rect x="4" y="6" width="32" height="28" fill="#f6f2ea" stroke="#000" />
      <rect x="4" y="6" width="32" height="5" fill="#f2b3a6" stroke="#000" />
      <circle cx="14" cy="21" r="4" fill="#b8acd9" stroke="#000" />
      <path d="M8 30c1-5 11-5 12 0" fill="#b8acd9" stroke="#000" />
      <path d="M23 18h9M23 22h9M23 26h6" stroke="#000" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 40 40">
      <path d="M3 10h13l3 3h18v21H3z" fill="#b8acd9" stroke="#000" />
      <path d="M3 15h34" stroke="#000" />
      <rect x="10" y="19" width="8" height="8" fill="#f2b3a6" stroke="#000" />
      <rect x="22" y="19" width="8" height="8" fill="#f0d999" stroke="#000" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 40 40">
      <rect x="4" y="5" width="32" height="30" fill="#f6f2ea" stroke="#000" />
      <rect x="9" y="22" width="5" height="9" fill="#f2b3a6" stroke="#000" />
      <rect x="17" y="14" width="5" height="17" fill="#b8acd9" stroke="#000" />
      <rect x="25" y="18" width="5" height="13" fill="#a9c4b0" stroke="#000" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 40 40">
      <rect x="4" y="9" width="32" height="22" fill="#f6f2ea" stroke="#000" />
      <path d="M4 9l16 13L36 9" fill="none" stroke="#000" />
      <circle cx="31" cy="27" r="5" fill="#f2b3a6" stroke="#000" />
      <path d="M29 27h4" stroke="#000" />
    </svg>
  ),
  readme: (
    <svg viewBox="0 0 40 40">
      <path d="M8 3h17l7 7v27H8z" fill="#f6f2ea" stroke="#000" />
      <path d="M25 3v7h7" fill="#f0d999" stroke="#000" />
      <path d="M12 16h16M12 20h16M12 24h16M12 28h10" stroke="#000" />
    </svg>
  ),
};

export function Folder({ color }) {
  return (
    <svg viewBox="0 0 40 40">
      <path d="M3 10h13l3 3h18v21H3z" fill={color} stroke="#000" />
      <path d="M3 15h34" stroke="#000" />
    </svg>
  );
}

export function Logo() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <rect x="1" y="1" width="18" height="18" fill="#f2b3a6" stroke="#000" />
      <path d="M6 14V6l8 8V6" fill="none" stroke="#000" strokeWidth="2" />
    </svg>
  );
}
