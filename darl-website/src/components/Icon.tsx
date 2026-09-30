import type { SVGProps } from "react";

const paths = {
  food: (
    <>
      <path d="M7 3v7a3 3 0 0 0 6 0V3M10 3v18" />
      <path d="M17 21V3c2.2 1.3 3.5 3.8 3.5 7s-1.3 4.5-3.5 5" />
    </>
  ),
  water: (
    <>
      <path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3Z" />
      <path d="M9 15a3 3 0 0 0 3 3" />
    </>
  ),
  environment: (
    <>
      <path d="M5 20c0-9 5-14 15-15-1 10-6 15-15 15Z" />
      <path d="M5 20 13 12" />
    </>
  ),
  pharma: (
    <>
      <rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="m9.5 9.5 5 5" />
    </>
  ),
  pipe: (
    <>
      <path d="M3 8h9a4 4 0 0 1 4 4v9M3 13h7a1 1 0 0 1 1 1v7" />
      <path d="M3 6v9M14 21h9" />
    </>
  ),
  material: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l6 4v-4l6 4V5h4v16H3Z" />
      <path d="M7 17h2M12 17h2" />
    </>
  ),
  construction: (
    <>
      <path d="M3 21h18M5 21V11l7-6 7 6v10" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
      <path d="M7 15h10" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 21h12M8 18h8M12 18a6 6 0 0 0 6-6" />
      <path d="m9 4 3 1.5-3 6L6 10l3-6ZM9.5 11.5 11 14" />
    </>
  ),
  thermo: <path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0ZM12 9v8" />,
  barcode: <path d="M4 5v14M7 5v14M10 5v14M14 5v14M16 5v14M20 5v14" />,
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="m7 15 3-5 3 3 4-7" />
    </>
  ),
  report: (
    <>
      <path d="M7 3h7l5 5v13H7V3Z" />
      <path d="M14 3v5h5M10 13h6M10 17h4" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v11h14V9M10 13h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  check: <path d="m5 12 5 5L20 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />,
  play: <path d="M8 5v14l11-7L8 5Z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
