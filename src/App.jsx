
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from "./screens/home";
import Pokemon from "./screens/pokemon";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<Pokemon />} />
      </Routes>
    </Router>
  );
}

export default App;
