import React, { useState } from 'react';

interface Wps3LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const OFFICIAL_WPS3_LOGO_URL =
  'https://cdn.phototourl.com/member/2026-10-23-1dc6c0a6-90ad-49b3-9478-db90d88d03d6.png';

export const Wps3Logo: React.FC<Wps3LogoProps> = ({ size = 'md', showTagline = false }) => {
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  }[size];

  const fontSize = {
    sm: 'text-xs',
    md: 'text-sm font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl font-black',
  }[size];

  return (
    <div className="flex flex-col items-center select-none group">
      {/* Outer Glowing Emblem */}
      <div
        className={`relative ${dimensions} flex items-center justify-center rounded-full bg-gradient-to-b from-[#031B44] via-[#050C1F] to-[#02050E] p-[3px] shadow-[0_0_25px_rgba(0,140,255,0.6)] border-2 border-[#008CFF] transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(0,140,255,0.95)]`}
      >
        {/* Subtle Outer Rotating Ring */}
        <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#008CFF]/50 animate-[spin_20s_linear_infinite]" />

        {/* Golden Crown on Top */}
        <div className="absolute -top-3.5 z-20 flex items-center justify-center filter drop-shadow-[0_0_8px_#FFC928]">
          <svg className="w-6 h-6 text-[#FFC928]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
          </svg>
        </div>

        {/* Center Container: Official Hosted Logo Image or Fallback */}
        <div className="relative w-full h-full rounded-full bg-[#030817] flex items-center justify-center overflow-hidden border border-[#008CFF]/40">
          {!imageError ? (
            <img
              src={OFFICIAL_WPS3_LOGO_URL}
              alt="WPS3 Official Logo"
              className="w-full h-full object-cover rounded-full filter contrast-110 drop-shadow-[0_0_10px_rgba(0,140,255,0.5)]"
              onError={() => setImageError(true)}
              loading="eager"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <span
                className={`${fontSize} tracking-wider font-chakra text-[#F4F8FF] drop-shadow-[0_0_8px_#008CFF] font-black`}
                style={{ letterSpacing: '0.08em' }}
              >
                WPS<span className="text-[#008CFF]">3</span>
              </span>
              <div className="h-[2px] w-3/4 bg-gradient-to-r from-transparent via-[#FFC928] to-transparent mt-0.5" />
              <div className="text-[7px] font-chakra font-bold text-[#8B5CFF] tracking-widest uppercase mt-0.5">
                MC PS3
              </div>
            </div>
          )}
        </div>
      </div>

      {showTagline && (
        <div className="mt-2 text-center">
          <div className="text-sm font-bold tracking-widest text-[#008CFF] font-chakra uppercase drop-shadow-[0_0_8px_rgba(0,140,255,0.6)]">
            WPS3 SERVER
          </div>
          <div className="text-[11px] text-[#A6C5FF] tracking-wider font-medium">
            MINECRAFT PLAYSTATION 3
          </div>
        </div>
      )}
    </div>
  );
};
