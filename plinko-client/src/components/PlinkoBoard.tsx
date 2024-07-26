import { useState, useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';

interface Ball {
    id: number;
    position: number;  // Y-axis position in percentage
    left: number;      // X-axis position in percentage
    velocityX: number; // X-axis velocity
    velocityY: number; // Y-axis velocity
}

interface Peg {
    top: number;  // Top position in percentage
    left: number; // Left position in percentage
}

export default function PlinkoBoard() {
    const [balls, setBalls] = useState<Ball[]>([]);
    const [pegs, setPegs] = useState<Peg[]>([]);

    const dropBall = () => {
        const newBall: Ball = {
            id: balls.length,
            position: 0,
            left: Math.random() * 80 + 10, // Start ball in a more visible range
            velocityX: Math.random() * 2 - 1,
            velocityY: 1,
        };
        setBalls((prevBalls) => [...prevBalls, newBall]);
    };

    useEffect(() => {
        const initialPegs: Peg[] = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 5; j++) {
                initialPegs.push({
                    top: (i + 1) * 10,
                    left: (j + 1) * 20,
                });
            }
        }
        setPegs(initialPegs);
    }, []); // Run only once on mount

    useEffect(() => {
        const interval = setInterval(() => {
            setBalls((prevBalls) => 
                prevBalls.map((ball) => {
                    if (ball.position < 100) {
                        let newPosition = ball.position + ball.velocityY;
                        let newLeft = ball.left + ball.velocityX;

                        // Check for collisions with pegs
                        pegs.forEach((peg) => {
                            const pegTop = peg.top;
                            const pegLeft = peg.left;

                            const distanceX = Math.abs(newLeft - pegLeft);
                            const distanceY = Math.abs(newPosition - pegTop);

                            if (distanceX < 5 && distanceY < 5) {
                                ball.velocityY = -ball.velocityY;
                                ball.velocityX = -ball.velocityX;
                            }
                        });

                        if (newLeft < 0 || newLeft > 95) {
                            ball.velocityX = -ball.velocityX;
                        }

                        return {
                            ...ball,
                            position: newPosition,
                            left: newLeft,
                        };
                    }
                    return ball;
                })
            );
        }, 16); // ~60 FPS

        return () => clearInterval(interval);
    }, [pegs]); // Depend on pegs to avoid infinite loop

    // Use useSprings to handle multiple balls
    const springs = useSprings(
        balls.length,
        balls.map((ball) => ({
            to: { top: `${ball.position}%`, left: `${ball.left}%` },
            config: { mass: 1, tension: 170, friction: 26 },
            reset: true,
        }))
    );

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-green-700'>
            <h1 className='text-4xl font-bold text-white mb-4'>
                PLINKO
            </h1>
            <div className='relative w-full max-w-md h-96 bg-gray-800 border-4 border-gray-700 rounded-lg overflow-hidden'>
                {pegs.map((peg, index) => (
                    <div
                        key={index}
                        className='absolute w-2 h-2 bg-white rounded-full'
                        style={{ top: `${peg.top}%`, left: `${peg.left}%` }}
                    ></div>
                ))}
                {springs.map((springProps, index) => (
                    <animated.div
                        key={balls[index]?.id} // Ensure key exists
                        className='absolute w-4 h-4 bg-red-500 rounded-full'
                        style={springProps}
                    ></animated.div>
                ))}
            </div>
            <button
                className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-full'
                onClick={dropBall}
            >
                Drop Ball
            </button>
        </div>
    );
}
