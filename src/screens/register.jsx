import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; // Réutilisation des styles de login.css
import { register } from '/src/services/api'; // Import de la fonction register depuis api.js

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Utilisation de la fonction register depuis api.js
      await register(email, name, password);
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirige vers la page de connexion après 3 secondes
    } catch (err) {
      setError('Erreur lors de la création du compte. Veuillez réessayer.');
      setSuccess('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Créer un compte</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit">S'inscrire</button>
        </form>
        {/* Lien pour retourner à la page de connexion */}
        <p className="register-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;