import { useState, useEffect } from 'react'

interface Ball {
    id: number;
    position: number;
    left: number;
    velocityX: number;
    velocityY: number;
}

export default function PlinkoBoard() {

    const [balls, setBalls] = useState<Ball[]>([])

    const dropBall = () => {
        const newBall: Ball = {
            id: balls.length,
            position: 0,
            left: Math.random() * 90 + 5,
            velocityX: Math.random() * 2 - 1,
            velocityY: 1
        }
        setBalls([...balls, newBall])
    }

    const pegs = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 5; j++) {
            pegs.push({ top: `${(i + 1) * 10}%`, left: `${(j + 1) * 20}%`})
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
          setBalls((prevBalls) =>
            prevBalls.map((ball) => {
              if (ball.position < 100) {
                // Update position based on velocity
                let newPosition = ball.position + ball.velocityY;
                let newLeft = ball.left + ball.velocityX;
      
                // Check for collisions with pegs
                pegs.forEach((peg) => {
                  const pegTop = parseFloat(peg.top);
                  const pegLeft = parseFloat(peg.left);
      
                  // Simple distance-based collision detection
                  const distance = Math.sqrt(
                    Math.pow(newPosition - pegTop, 2) +
                    Math.pow(newLeft - pegLeft, 2)
                  );
      
                  if (distance < 5) { // Collision detected (radius of peg and ball)
                    // Reflect the ball's velocity
                    ball.velocityY = -ball.velocityY;
                    ball.velocityX = -ball.velocityX;
                  }
                });
      
                // Update ball position
                return {
                  ...ball,
                  position: newPosition,
                  left: newLeft,
                };
              }
              return ball;
            })
          );
        }, 100);
      
        return () => clearInterval(interval);
      }, []);

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
                        style={{ top: peg.top, left: peg.left}}
                    ></div>
                ))}
                {balls.map((ball) => (
                    <div
                        key={ball.id}
                        className='absolute w-4 h-4 bg-red-500 rounded-full'
                        style={{ top: `${ball.position}%`, left: `${ball.left}%` }}
                    ></div>
                ))}
            </div>
            <button
                className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-full'
                onClick={dropBall}
            >
                Drop Ball
            </button>
        </div>
    )
}