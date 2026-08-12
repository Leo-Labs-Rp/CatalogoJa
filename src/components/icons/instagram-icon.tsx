import type { ComponentProps } from "react";

export function InstagramIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height="18" rx="5" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}
