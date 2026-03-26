import './css/App.css'
import Home from './pages/Home'
import Favourites from './pages/Favourites'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import { CDProvider } from './contexts/CDContext'

function App() {
  return (
    <CDProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </main>
    </CDProvider>
  )
}

export default App
