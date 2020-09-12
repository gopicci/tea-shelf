import React, { ReactElement } from "react";

/**
 * React component of svg logo.
 *
 * @component
 * @subcategory Generics
 */
function Logo(): ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <mask id="a" maskUnits="userSpaceOnUse">
          <circle cx="256" cy="256" r="256" fill="#ececec" />
        </mask>
      </defs>
      <circle r="256" cy="256" cx="256" fill="#f2f2f2" />
      <circle
        r="229.7"
        cy="256"
        cx="256"
        fill="none"
        stroke="red"
        strokeWidth="9"
      />
      <circle
        r="165.5"
        cy="256"
        cx="256"
        fill="none"
        stroke="gray"
        strokeWidth="70.1"
        strokeDasharray="140 70"
        strokeDashoffset="182.3"
      />
      <circle
        cx="256"
        cy="256"
        r="75.2"
        fill="none"
        stroke="red"
        strokeWidth="18"
      />
      <circle r="50.8" cy="256" cx="256" fill="green" />
      <path
        mask="url(#a)"
        d="M276-101c83 301 38 486-204 702 0 10 798 19 798 9S690-220 660-240 276-101 276-101z"
        fillOpacity=".1"
        style={{
          fill: "#000000",
          fillOpacity: 0.08,
          stroke: "none",
          strokeWidth: "1px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeOpacity: 1,
        }}
      />
    </svg>
  );
}

export default Logo;
