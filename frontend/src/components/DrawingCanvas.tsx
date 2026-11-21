import { useRef } from 'react'
import CanvasDraw from 'react-canvas-draw'

function DrawingCanvas() {
  const canvasRef = useRef<CanvasDraw>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <CanvasDraw
        ref={canvasRef}
        canvasWidth={600}
        canvasHeight={400}
        brushRadius={1.5}
        brushColor="#0f172a"
        lazyRadius={0}
        hideGrid
        hideInterface
        style={{
          position: 'relative',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
      />
      <button type="button" onClick={() => canvasRef.current?.clear()}>
        Clear Canvas
      </button>
    </div>
  )
}

export default DrawingCanvas
