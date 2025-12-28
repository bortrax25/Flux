import React from 'react';

interface LiquidGaugeProps {
  value: number; // 0 to 100
}

const LiquidGauge: React.FC<LiquidGaugeProps> = ({ value }) => {
  // Clamp value between 0 and 100
  const percentage = Math.min(Math.max(value, 0), 100);

  // Path definition for the wave
  const wavePath = "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

  const WaveLayer = ({ opacity, animationClass, reverse = false }: { opacity: string, animationClass: string, reverse?: boolean }) => (
    <div className={`absolute top-0 left-0 w-[200%] h-full flex ${animationClass} ${reverse ? 'flex-row-reverse' : ''} ${opacity}`}>
       <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
         <path fill="#10b981" fillOpacity="1" d={wavePath} />
       </svg>
       <svg className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
         <path fill="#10b981" fillOpacity="1" d={wavePath} />
       </svg>
    </div>
  );

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Liquid Container */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-flux-500/20 backdrop-blur-[2px] transition-all duration-1000 ease-in-out"
        style={{ height: `${percentage}%` }}
      >
        {/* Wave Animation Container */}
        <div className="absolute top-0 left-0 right-0 -mt-16 h-32 w-full overflow-hidden">
            {/* Back Wave */}
            <WaveLayer opacity="opacity-30" animationClass="animate-wave-slow" />
            
            {/* Front Wave (slightly offset via margin or transform, but simple layer is enough) */}
            <div className="absolute top-2 w-full h-full">
               <WaveLayer opacity="opacity-60" animationClass="animate-wave-fast" />
            </div>
        </div>
      </div>
      
      {/* Glow / Depth Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-flux-900/90 via-flux-900/40 to-transparent"></div>
    </div>
  );
};

export default LiquidGauge;