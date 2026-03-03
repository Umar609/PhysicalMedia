import './App.css'
import CdCard from './components/CDCard'  

function App() {
  return (
    <>
      <CdCard cd={{ title: "Dawn FM", artist: "The Weeknd", url: "https://via.placeholder.com/150" }} />
      <CdCard cd={{ title: "After Hours", artist: "The Weeknd", url: "https://via.placeholder.com/150" }} />
      <CdCard cd={{ title: "Hurry Up Tomorrow", artist: "The Weeknd", url: "https://via.placeholder.com/150" }} />
      <CdCard cd={{ title: "Kissland", artist: "The Weeknd", url: "https://via.placeholder.com/150" }} />
    </>
  )
}

export default App
