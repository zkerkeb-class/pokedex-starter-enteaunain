import React from 'react';
import { Navigate } from 'react-router-dom';

const privateRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');

  // Si le token n'existe pas, redirigez vers la page de connexion
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default privateRoute;