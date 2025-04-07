import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPokemon, getAllPokemons } from '/src/services/api'; // Import de la fonction API pour créer un Pokémon
import './pokemon.css'; // Réutilisation des styles de pokemon.css

const AddPokemon = () => {
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [attack, setAttack] = useState('');
  const [defense, setDefense] = useState('');
  const [specialAttack, setSpecialAttack] = useState('');
  const [specialDefense, setSpecialDefense] = useState('');
  const [speed, setSpeed] = useState('');
  const [type, setType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [nextId, setNextId] = useState(null);

  // Récupérer le nombre total de Pokémon pour calculer le prochain ID
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getAllPokemons(1, 1000); // Récupère tous les Pokémon (limite élevée)
        const totalPokemons = data.pokemons.length;
        setNextId(totalPokemons + 1); // Calculer le prochain ID
      } catch (err) {
        console.error('Erreur lors de la récupération des Pokémon :', err);
        setError('Impossible de récupérer les Pokémon existants.');
      }
    };

    fetchPokemons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nextId) {
        setError('Impossible de calculer l\'ID du Pokémon.');
        return;
      }

    const newPokemon = {
        id: nextId,
        name: { french: name,
            japanese: name,
            english: name,
            chinese: name
        },
        stats: {
            hp: parseInt(hp, 10),
            attack: parseInt(attack, 10),
            defense: parseInt(defense, 10),
            specialAttack: parseInt(specialAttack, 10),
            specialDefense: parseInt(specialDefense, 10),
            speed: parseInt(speed, 10),
        },
        type: type.split(',').map((t) => t.trim()), // Convertir la chaîne en tableau
        image: imageUrl,
    };

    try {
        await createPokemon(newPokemon); // Appel API pour créer le Pokémon
        setSuccess('Pokémon créé avec succès !');
        setError('');
        setTimeout(() => navigate('/'), 3000); // Redirige vers la page d'accueil après 3 secondes
        } catch (err) {
        setError('Erreur lors de la création du Pokémon. Veuillez réessayer.');
        setSuccess('');
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Retourne à la page précédente
    };

  return (
    <div className="pokemon-page">
        <button className="back-button" onClick={handleBackClick}>
                Retour
        </button>
      <h1>Ajouter un Pokémon</h1>
      <div className="edit-form">
        <form onSubmit={handleSubmit}>
          <label>
            Nom :
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            HP :
            <input
              type="number"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              required
            />
          </label>
          <label>
            Attaque :
            <input
              type="number"
              value={attack}
              onChange={(e) => setAttack(e.target.value)}
              required
            />
          </label>
          <label>
            Défense :
            <input
              type="number"
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              required
            />
          </label>
          <label>
            Attaque Spéciale :
            <input
              type="number"
              value={specialAttack}
              onChange={(e) => setSpecialAttack(e.target.value)}
              required
            />
          </label>
          <label>
            Défense Spéciale :
            <input
              type="number"
              value={specialDefense}
              onChange={(e) => setSpecialDefense(e.target.value)}
              required
            />
          </label>
          <label>
            Vitesse :
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              required
            />
          </label>
          <label>
            Type(s) (séparés par des virgules) :
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </label>
          <label>
            URL de l'image :
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="apply">Créer</button>
        </form>
      </div>
    </div>
  );
};

export default AddPokemon;