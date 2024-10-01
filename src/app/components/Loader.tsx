import React from 'react';
import Box from '@mui/material/Box';

interface LoaderProps {
    show: boolean;
    sx?: any;
}

const Loader = ({ show, sx }: LoaderProps) => {
    const bars = Array.from({ length: 12 }, (_, i) => ({
        style: {
            transform: `rotate(${i * 30}deg) translate(0, -100%)`,
            animationDelay: `${-1.1 * (i / 12)}s`,
        },
        key: `bar-${i}`,
    }));

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                display: show ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999,
                ...sx
            }}
        >
            {show && (
                <div className="relative w-14 h-14 flex justify-center items-center">
                    <style jsx>{`
                        @keyframes fade458 {
                            0% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0.25;
                            }
                        }

                        .animate-fade458 {
                            animation: fade458 1s linear infinite;
                        }

                        .bar {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 8%;
                            height: 24%;
                            background: #3A8340; 
                            border-radius: 50px;
                            box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
                            opacity: 0;
                            transform-origin: center;
                            transform: translateX(-50%) translateY(-50%);
                        }

                        .bar1 { transform: rotate(0deg) translate(0, -100%); animation-delay: 0s; }
                        .bar2 { transform: rotate(30deg) translate(0, -100%); animation-delay: -1.1s; }
                        .bar3 { transform: rotate(60deg) translate(0, -100%); animation-delay: -1s; }
                        .bar4 { transform: rotate(90deg) translate(0, -100%); animation-delay: -0.9s; }
                        .bar5 { transform: rotate(120deg) translate(0, -100%); animation-delay: -0.8s; }
                        .bar6 { transform: rotate(150deg) translate(0, -100%); animation-delay: -0.7s; }
                        .bar7 { transform: rotate(180deg) translate(0, -100%); animation-delay: -0.6s; }
                        .bar8 { transform: rotate(210deg) translate(0, -100%); animation-delay: -0.5s; }
                        .bar9 { transform: rotate(240deg) translate(0, -100%); animation-delay: -0.4s; }
                        .bar10 { transform: rotate(270deg) translate(0, -100%); animation-delay: -0.3s; }
                        .bar11 { transform: rotate(300deg) translate(0, -100%); animation-delay: -0.2s; }
                        .bar12 { transform: rotate(330deg) translate(0, -100%); animation-delay: -0.1s; }
                    `}</style>
                    {bars.map(({ style, key }) => (
                        <div
                            key={key}
                            className={`bar animate-fade458 ${key}`}
                            style={style}
                        ></div>
                    ))}
                </div>
            )}
        </Box>
    );
};

export default Loader;
