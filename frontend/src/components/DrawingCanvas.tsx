import { useRef, type PointerEvent } from 'react'
import CanvasDraw from 'react-canvas-draw'

type Point = { x: number; y: number }
type Stroke = { points: Point[]; brushColor: string }

function getCanvasPoint(event: PointerEvent<HTMLDivElement>): Point | undefined {
  const canvas = event.target
  if (!(canvas instanceof HTMLCanvasElement)) return

  const { left, top, width, height } = canvas.getBoundingClientRect()
  const x = event.clientX - left
  const y = event.clientY - top
  if (width === 0 || height === 0 || x < 0 || y < 0 || x > width || y > height) return

  return { x: (x / width) * canvas.width, y: (y / height) * canvas.height }
}

function DrawingCanvas({ brushColor }: { brushColor: string }) {
  const canvasRef = useRef<CanvasDraw>(null)
  const strokes = useRef<Stroke[]>([])
  const activeStroke = useRef<{ pointerId: number; stroke: Stroke } | null>(null)

  function startStroke(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || activeStroke.current) return

    const point = getCanvasPoint(event)
    if (point) {
      activeStroke.current = {
        pointerId: event.pointerId,
        stroke: { points: [point], brushColor },
      }
    }
  }

  function recordPoint(event: PointerEvent<HTMLDivElement>) {
    const active = activeStroke.current
    if (!active || active.pointerId !== event.pointerId) return

    const point = getCanvasPoint(event)
    if (!point) {
      endStroke(event)
      return
    }

    const previousPoint = active.stroke.points.at(-1)
    if (point.x !== previousPoint?.x || point.y !== previousPoint?.y) {
      active.stroke.points.push(point)
    }
  }

  function endStroke(event: PointerEvent<HTMLDivElement>) {
    const active = activeStroke.current
    if (!active || active.pointerId !== event.pointerId) return

    strokes.current.push(active.stroke)
    activeStroke.current = null
  }

  function finishStroke(event: PointerEvent<HTMLDivElement>) {
    recordPoint(event)
    endStroke(event)
  }

  function clearCanvas() {
    canvasRef.current?.clear()
    activeStroke.current = null
    strokes.current = []
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <div
        onPointerDown={startStroke}
        onPointerMove={recordPoint}
        onPointerUp={finishStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
      >
        <CanvasDraw
          ref={canvasRef}
          canvasWidth={600}
          canvasHeight={400}
          brushRadius={1.5}
          brushColor={brushColor}
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
      </div>
      <button type="button" onClick={clearCanvas}>
        Clear Canvas
      </button>
    </div>
  )
}

export default DrawingCanvas
