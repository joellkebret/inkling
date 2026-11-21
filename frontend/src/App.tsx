import DrawingCanvas from './components/DrawingCanvas'
import './App.css'

function App() {
  return (
    <main id="center">
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <DrawingCanvas />
      </div>
    </main>
  )
}

export default App
