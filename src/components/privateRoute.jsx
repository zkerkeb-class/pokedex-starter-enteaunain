import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const isTokenExpired = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Temps actuel en secondes
    return decoded.exp < currentTime; // Retourne true si le token est expiré
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return true; // Considérer le token comme expiré en cas d'erreur
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  // Si le token n'existe pas ou est expiré, redirigez vers la page de connexion
  if (!token || isTokenExpired()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;