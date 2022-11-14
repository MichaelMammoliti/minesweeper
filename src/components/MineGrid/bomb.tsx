import React from "react";

export const Bomb = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7.99999" cy="7.99999" r="5.6" fill="white" />
    <rect y="6.39999" width="16" height="3.2" fill="white" />
    <rect
      x="0.800003"
      y="12.8"
      width="16.8"
      height="3.2"
      transform="rotate(-45 0.800003 12.8)"
      fill="white"
    />
    <rect
      x="3.2"
      y="0.800003"
      width="16.8"
      height="3.2"
      transform="rotate(45 3.2 0.800003)"
      fill="white"
    />
    <rect
      x="9.60001"
      width="16"
      height="3.2"
      transform="rotate(90 9.60001 0)"
      fill="white"
    />
  </svg>
);
