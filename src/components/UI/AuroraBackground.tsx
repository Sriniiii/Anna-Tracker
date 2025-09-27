import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
      <div
        className="animate-aurora"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))',
          height: '200%',
          width: '200%',
          position: 'absolute',
          inset: '-50%',
        }}
      />
    </div>
  );
};

export default AuroraBackground;
