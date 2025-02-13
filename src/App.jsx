import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CartePok from './components/cartePok/cartePok.jsx'
import './App.css'

function App() {
  var [count, setCount] = useState(0)
  return (
    <>
      
      <h1>POKEMON</h1>
      <h3>Appuyez sur le compteur pour faire défiler les pokémons !</h3>
      <grid className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Le compteur est à {count}
        </button>
      </grid>
      <CartePok count={count} />
    </>
  )
}

export default App