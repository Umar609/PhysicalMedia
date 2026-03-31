import './css/App.css'
import Home from './pages/Home'
import Owned from './pages/Owned'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import LogIn from './pages/LogIn'
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
          <Route path="/owned" element={<Owned />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Login" element={<LogIn />} />
        </Routes>
      </main>
    </CDProvider>
  )
}

export default App
