import React from 'react';

const Loader = () => {
  return (
    <div className="backdrop-blur-xs relative text-base w-20 h-20">
      {/* The platform/slope that the rock rolls on */}
      <div className="absolute left-1/2 top-1/2 w-1 h-full transform -translate-x-1/2 -translate-y-1/2 rotate-45" style={{backgroundColor: '#404041'}}></div>
      
      {/* The rolling rock */}
      <div 
        className="absolute left-1 bottom-1 w-4 h-4 bg-orange-500 rounded-sm animate-rolling-rock"
        style={{
          borderRadius: '15%'
        }}
      ></div>
      
      <style>{`
        @keyframes rolling-rock {
          0% {
            transform: translate(0, -1rem) rotate(-45deg);
          }
          5% {
            transform: translate(0, -1rem) rotate(-50deg);
          }
          20% {
            transform: translate(1rem, -2rem) rotate(47deg);
          }
          25% {
            transform: translate(1rem, -2rem) rotate(45deg);
          }
          30% {
            transform: translate(1rem, -2rem) rotate(40deg);
          }
          45% {
            transform: translate(2rem, -3rem) rotate(137deg);
          }
          50% {
            transform: translate(2rem, -3rem) rotate(135deg);
          }
          55% {
            transform: translate(2rem, -3rem) rotate(130deg);
          }
          70% {
            transform: translate(3rem, -4rem) rotate(217deg);
          }
          75% {
            transform: translate(3rem, -4rem) rotate(220deg);
          }
          100% {
            transform: translate(0, -1rem) rotate(-225deg);
          }
        }
        
        .animate-rolling-rock {
          animation: rolling-rock 2.5s cubic-bezier(0.79, 0, 0.47, 0.97) infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;