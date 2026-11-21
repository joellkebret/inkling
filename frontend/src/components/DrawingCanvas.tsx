import React, { useRef, useEffect, useState } from 'react';

type Point = { x: number; y: number };
type Stroke = Point[];

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Helper to get coordinates relative to the canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Redraw all saved strokes and the active stroke whenever state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configure line styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';

    const drawStroke = (stroke: Stroke) => {
      if (stroke.length === 0) return;

      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);

      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    };

    strokes.forEach(drawStroke);
    drawStroke(currentStroke);
  }, [strokes, currentStroke]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Capture pointer so dragging outside the canvas doesn't break the stroke
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getCoordinates(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentStroke([point]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const point = getCoordinates(e);
    if (!point) return;

    setCurrentStroke((prev) => [...prev, point]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        // 'touchAction: none' prevents mobile browsers from scrolling while you draw
        style={{ border: '1px solid #cbd5e1', borderRadius: '8px', touchAction: 'none', cursor: 'crosshair' }}
      />
      <button onClick={handleClear} type="button">
        Clear Canvas
      </button>
    </div>
  );
}

export default DrawingCanvas;
