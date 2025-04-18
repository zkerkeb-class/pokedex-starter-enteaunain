
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Login from './screens/login';
import Register from './screens/register';
import Home from "./screens/home";
import Pokemon from "./screens/pokemon";
import AddPokemon from "./screens/add-pokemon";
import Game from "./screens/game";
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/pokemon/:id"
          element={
            <PrivateRoute>
              <Pokemon />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-pokemon"
          element={
            <PrivateRoute>
              <AddPokemon />
            </PrivateRoute>
          }
        />
        <Route
          path="/game/:id"
          element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
