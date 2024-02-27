import { useState } from 'react'
import './App.css'
import ImageUplaod from './components/ImageUpload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='body'>
      <h1>Breast Cancer prediction app</h1>
      <ImageUplaod/>
    </div>
  )
}

export default App
