import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Roulette from './pages/Roulette.jsx'
import Header from './components/Header.jsx'
import Map from './pages/Map.jsx'
import Notice from './components/Notice.jsx'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div className="pt-12">
          <Routes>
            <Route path="/" element={
              <>
                <Roulette />
                <Notice />
              </>
            } />
            <Route path="/map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
