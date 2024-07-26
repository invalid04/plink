import React, { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Bodies, Composite } from 'matter-js';

const worldWidth = 800;
const startPins = 5;
const pinLines = 25;
const pinSize = 5; // Adjusted pin size for appropriate visibility
const pinGap = 30;
const ballSize = 5; // Increased ball size for visibility
const ballElasticity = 0.75;
const boardColor = '#282c34'; // Board color
const pegColor = '#C0C2C9';   // Peg color
const ballColor = '#DC143C';     // Ball color

const PlinkoBoard: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine and renderer
    const engine = Engine.create();
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: worldWidth,
        height: 600,
        wireframes: false, // Disable wireframes
        background: boardColor, // Set the background color of the board
      },
    });
    const runner = Runner.create();

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    // Create pins
    const pins = [];
    for (let l = 0; l < pinLines; l++) {
      const linePins = startPins + l;
      const lineWidth = linePins * pinGap;
      for (let i = 0; i < linePins; i++) {
        const pin = Bodies.circle(
          worldWidth / 2 - lineWidth / 2 + i * pinGap,
          100 + l * pinGap,
          pinSize,
          { isStatic: true, render: { fillStyle: pegColor } }
        );
        pins.push(pin);
      }
    }
    Composite.add(engine.world, pins);

    // Create initial ball
    const createBall = (x: number, y: number) => Bodies.circle(x, y, ballSize, {
      restitution: ballElasticity,
      render: { fillStyle: ballColor }, // Ball color
    });

    const initialBall = createBall(worldWidth / 2, 0);
    Composite.add(engine.world, [initialBall]);

    // Run the renderer
    Render.run(render);
    Runner.run(runner, engine);

    // Click event listener to add balls
    const handleClick = (e: MouseEvent) => {
      if (!renderRef.current) return;
      const rect = renderRef.current.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newBall = createBall(x, y);
      Composite.add(engine.world, [newBall]);
    };
    window.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current);
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Composite.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Plinko Game</h1>
      <div
        ref={canvasRef}
        className="relative bg-gray-800 border-4 border-gray-700 rounded-lg"
        style={{ width: '810px', height: '610px' }}
      />
    </div>
  );
};

export default PlinkoBoard;
