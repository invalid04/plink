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


    return (
        <div className='text-red-400'>
            hi
        </div>
    )
}