'use client';

import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  screenWidth?: number;
  screenType?: string;
  frameColor?: string;
  hideStatusBar?: boolean;
  transparentNavBar?: boolean;
  hideNavBar?: boolean;
}

export function IPhoneMockup({
  children,
  className = '',
}: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto rounded-[46px] border-[10px] border-[#1c1917] bg-[#1c1917] shadow-2xl overflow-hidden aspect-[9/19] max-w-[280px] w-full ${className}`}
    >
      {/* Dynamic Island Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-stone-800" />
      </div>
      {/* Screen */}
      <div className="w-full h-full rounded-[36px] overflow-hidden bg-black">
        {children}
      </div>
    </div>
  );
}

export function IPadMockup({
  children,
  className = '',
}: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto rounded-[36px] border-[12px] border-[#1c1917] bg-[#1c1917] shadow-2xl overflow-hidden aspect-[4/3] max-w-[600px] w-full ${className}`}
    >
      <div className="w-full h-full rounded-[24px] overflow-hidden bg-black">
        {children}
      </div>
    </div>
  );
}

export default IPhoneMockup;
