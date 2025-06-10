import { BrowserRouter } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Roulette from './pages/Roulette.jsx'
import Header from './components/Header.jsx'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div className="pt-12">
          <Roulette />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
