import React from 'react';
import './App.css';
import Home from './components/Home/Home';
import Cars from './components/Car/Cars';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/" element={<Home />} /> {/* Use element prop to specify component */}
          <Route path="/cars" element={<Cars />} /> {/* Use element prop to specify component */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;