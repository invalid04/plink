import React, { useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Bodies, Composite } from 'matter-js';

const worldWidth = 800;
const startPins = 5;
const pinLines = 25;
const pinSize = 3;
const pinGap = 30;
const ballSize = 5;
const ballElasticity = 0.75;
const boardColor = '#282c34'; // Board color
const pegColor = '#ff6347';   // Peg color

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
          { isStatic: true }
        );
        pins.push(pin);
      }
    }
    Composite.add(engine.world, pins);

    // Create initial ball
    const ball = Bodies.circle(worldWidth / 2, 0, ballSize, {
      restitution: ballElasticity,
    });
    Composite.add(engine.world, [ball]);

    // Custom rendering for pegs
    render.engine.world.bodies.forEach(body => {
      if (body.label === 'Circle Body') {
        body.render.fillStyle = pegColor; // Apply peg color
      }
    });

    // Run the renderer
    Render.run(render);
    Runner.run(runner, engine);

    // Click event listener to add balls
    const handleClick = (e: MouseEvent) => {
      if (!renderRef.current) return;
      const rect = renderRef.current.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newBall = Bodies.circle(x, y, ballSize, {
        restitution: ballElasticity,
      });
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

  return <div ref={canvasRef} style={{ width: worldWidth, height: '600px' }} />;
};

export default PlinkoBoard;
