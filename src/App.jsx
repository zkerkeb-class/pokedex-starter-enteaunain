import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CartePok from './components/cartePok/cartePok.jsx'
import './App.css'

//const bulbizarre = pokemons[0]

function App() {
  var [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h3>Appuyez sur le compteur pour faire défiler les pokémons !</h3>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Le compteur est à {count}
        </button>
      </div>
      <CartePok count={count} />
    </>
  )
}

export default App