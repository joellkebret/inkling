import DrawingCanvas from './components/DrawingCanvas'
import ColourPicker from './components/ColourPicker'
import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState('#b32aa9')

  return (
    <main id="center">
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <DrawingCanvas brushColor={color} />
        <ColourPicker value={color} onChange={setColor} />
      </div>
    </main>
  )
}

export default App
