import { useState, useEffect } from 'react'

interface Ball {
    id: number;
    position: number;
    left: number;
}

export default function PlinkoBoard() {

    const [balls, setBalls] = useState<Ball[]>([])

    const dropBall = () => {
        const newBall: Ball = {
            id: balls.length,
            position: 0,
            left: Math.random() * 90 + 5,
        }
        setBalls([...balls, newBall])
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setBalls((prevBalls) => 
                prevBalls.map((ball) =>
                    ball.position < 100
                    ? {...ball, position: ball.position + 1}
                    : ball
                )
            )
        }, 100)
        return () => clearInterval(interval)
    }, [])

    const pegs = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 5; j++) {
            pegs.push({ top: `${(i + 1) * 10}%`, left: `${(j + 1) * 20}%`})
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-green-700'>
            <h1 className='text-4xl font-bold text-white mb-4'>
                PLINKO
            </h1>
        </div>
    )
}