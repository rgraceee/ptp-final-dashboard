"use client";

export default function DataFlowAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        <g opacity="0.6">
          <line x1="100" y1="150" x2="400" y2="150" stroke="url(#lineGrad)" strokeWidth="1.5">
            <animate attributeName="x1" values="100;200;100" dur="4s" repeatCount="indefinite" />
            <animate attributeName="x2" values="400;500;400" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="400" y1="150" x2="700" y2="150" stroke="url(#lineGrad)" strokeWidth="1.5">
            <animate attributeName="x1" values="400;500;400" dur="4s" repeatCount="indefinite" />
            <animate attributeName="x2" values="700;800;700" dur="4s" repeatCount="indefinite" />
          </line>

          <line x1="150" y1="300" x2="450" y2="300" stroke="url(#lineGrad2)" strokeWidth="1.5">
            <animate attributeName="x1" values="150;250;150" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="450;550;450" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="450" y1="300" x2="750" y2="300" stroke="url(#lineGrad2)" strokeWidth="1.5">
            <animate attributeName="x1" values="450;550;450" dur="5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="750;850;750" dur="5s" repeatCount="indefinite" />
          </line>

          <line x1="100" y1="450" x2="350" y2="450" stroke="url(#lineGrad)" strokeWidth="1.5">
            <animate attributeName="x1" values="100;180;100" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="350;430;350" dur="3.5s" repeatCount="indefinite" />
          </line>
          <line x1="350" y1="450" x2="650" y2="450" stroke="url(#lineGrad)" strokeWidth="1.5">
            <animate attributeName="x1" values="350;430;350" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="650;730;650" dur="3.5s" repeatCount="indefinite" />
          </line>

          <circle cx="400" cy="150" r="4" fill="rgba(255,255,255,0.8)">
            <animate attributeName="cy" values="150;140;150" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="450" cy="300" r="4" fill="rgba(255,255,255,0.6)">
            <animate attributeName="cy" values="300;290;300" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="450" r="4" fill="rgba(255,255,255,0.8)">
            <animate attributeName="cy" values="450;440;450" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        <g opacity="0.3">
          <circle cx="100" cy="150" r="3" fill="white">
            <animate attributeName="cx" values="100;200;100" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="150" r="3" fill="white">
            <animate attributeName="cx" values="400;500;400" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="700" cy="150" r="3" fill="white">
            <animate attributeName="cx" values="700;800;700" dur="4s" repeatCount="indefinite" />
          </circle>

          <circle cx="150" cy="300" r="3" fill="white">
            <animate attributeName="cx" values="150;250;150" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="450" cy="300" r="3" fill="white">
            <animate attributeName="cx" values="450;550;450" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="750" cy="300" r="3" fill="white">
            <animate attributeName="cx" values="750;850;750" dur="5s" repeatCount="indefinite" />
          </circle>

          <circle cx="100" cy="450" r="3" fill="white">
            <animate attributeName="cx" values="100;180;100" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="450" r="3" fill="white">
            <animate attributeName="cx" values="350;430;350" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="450" r="3" fill="white">
            <animate attributeName="cx" values="650;730;650" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
