import React from 'react';

export const MinecraftBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Space Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040A] via-[#030817] to-[#010307]" />

      {/* Atmospheric Neon Blue Glow from Top & Center */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#008CFF]/15 blur-[120px] rounded-full" />
      <div className="absolute top-[40%] left-[10%] w-[500px] h-[400px] bg-[#8B5CFF]/10 blur-[130px] rounded-full" />
      <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[500px] bg-[#008CFF]/10 blur-[140px] rounded-full" />

      {/* Isometric/Voxel Minecraft Landscape Illustrations */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 object-cover"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Nether Portal Gradient */}
          <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A0E4E" />
            <stop offset="50%" stopColor="#8B5CFF" />
            <stop offset="100%" stopColor="#B388FF" />
          </linearGradient>

          {/* Glowing Waterfall Gradient */}
          <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#008CFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0047AB" stopOpacity="0.4" />
          </linearGradient>

          {/* Voxel Island Top Gradient */}
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E392A" />
            <stop offset="100%" stopColor="#11241B" />
          </linearGradient>

          {/* Voxel Dirt/Stone Gradient */}
          <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#161B26" />
            <stop offset="100%" stopColor="#0D111A" />
          </linearGradient>

          <filter id="glowPortal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Island Left */}
        <g transform="translate(60, 220)">
          {/* Voxel Island Base */}
          <polygon points="120,60 220,110 120,160 20,110" fill="url(#grassGrad)" stroke="#008CFF" strokeWidth="0.75" />
          <polygon points="20,110 120,160 120,240 20,190" fill="url(#stoneGrad)" stroke="#008CFF" strokeWidth="0.5" />
          <polygon points="120,160 220,110 220,190 120,240" fill="#0B0E17" stroke="#008CFF" strokeWidth="0.5" />

          {/* Voxel Cubic Mountain on Island */}
          <polygon points="120,20 160,40 120,60 80,40" fill="#1A2333" stroke="#008CFF" strokeWidth="0.5" />
          <polygon points="80,40 120,60 120,90 80,70" fill="#131926" stroke="#008CFF" strokeWidth="0.5" />
          <polygon points="120,60 160,40 160,70 120,90" fill="#0D121D" stroke="#008CFF" strokeWidth="0.5" />

          {/* Glowing Waterfall coming off the island edge */}
          <polygon points="110,155 130,165 125,320 115,310" fill="url(#waterfallGrad)" filter="url(#glowPortal)" />
          {/* Water Splash at bottom */}
          <circle cx="120" cy="320" r="14" fill="#00E5FF" opacity="0.3" filter="url(#glowPortal)" />
        </g>

        {/* Purple Glowing Nether Portal Right Floating Island */}
        <g transform="translate(1120, 180)">
          {/* Floating Island Base */}
          <polygon points="160,80 280,140 160,200 40,140" fill="url(#grassGrad)" stroke="#8B5CFF" strokeWidth="0.75" />
          <polygon points="40,140 160,200 160,280 40,220" fill="url(#stoneGrad)" stroke="#8B5CFF" strokeWidth="0.5" />
          <polygon points="160,200 280,140 280,220 160,280" fill="#0E131E" stroke="#8B5CFF" strokeWidth="0.5" />

          {/* Obsidian Portal Frame */}
          <rect x="135" y="45" width="50" height="75" fill="#120D1A" stroke="#4A154B" strokeWidth="4" rx="2" />
          {/* Glowing Nether Portal Core */}
          <rect
            x="142"
            y="52"
            width="36"
            height="61"
            fill="url(#portalGrad)"
            filter="url(#glowPortal)"
            opacity="0.85"
          >
            <animate attributeName="opacity" values="0.75;0.95;0.75" dur="3s" repeatCount="indefinite" />
          </rect>
          {/* Floating Nether Particles */}
          <circle cx="160" cy="70" r="2" fill="#E1BEE7" opacity="0.8">
            <animate attributeName="cy" values="90;40" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="85" r="1.5" fill="#E1BEE7" opacity="0.8">
            <animate attributeName="cy" values="95;50" dur="2.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2.1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Distant Cubic Voxel Mountains Silhouette in Center Bottom */}
        <g transform="translate(420, 620)" opacity="0.45">
          <polygon points="300,50 480,140 300,230 120,140" fill="#080E1C" stroke="#008CFF" strokeWidth="0.5" />
          <polygon points="120,140 300,230 300,320 120,230" fill="#050812" stroke="#008CFF" strokeWidth="0.5" />
          <polygon points="300,230 480,140 480,230 300,320" fill="#03050B" stroke="#008CFF" strokeWidth="0.5" />

          {/* Smaller floating voxel cube */}
          <g transform="translate(180, -90)">
            <polygon points="40,20 60,30 40,40 20,30" fill="#008CFF" opacity="0.7" />
            <polygon points="20,30 40,40 40,60 20,50" fill="#005BA3" opacity="0.7" />
            <polygon points="40,40 60,30 60,50 40,60" fill="#003D6D" opacity="0.7" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="180,-90; 180,-105; 180,-90"
              dur="4s"
              repeatCount="indefinite"
            />
          </g>
        </g>
      </svg>

      {/* Cyber/Minecraft Grid Lines Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #008CFF 1px, transparent 1px), linear-gradient(to bottom, #008CFF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};
