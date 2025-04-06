import React, { useEffect, useState } from 'react';
import CartePok from '../components/cartePok/cartePok.jsx';
import './home.css';
import { getAllPokemons } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function App() {
  const [pokemons, setPokemons] = useState([]); // Pokémon paginés
  const [allPokemons, setAllPokemons] = useState([]); // Tous les Pokémon pour la recherche
  const [page, setPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("");

  // Charger les Pokémon paginés
  useEffect(() => {
    fetchPaginatedPokemons();
  }, [page]);

  // Charger tous les Pokémon pour la recherche
  useEffect(() => {
    fetchAllPokemons();
  }, []);

  // Décoder le rôle de l'utilisateur depuis le token JWT
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Décoder le token
                setUserRole(decodedToken.role); // Récupérer le rôle depuis le payload
            } catch (error) {
                console.error("Erreur lors du décodage du token JWT :", error);
            }
        }
  }, []);

  const fetchPaginatedPokemons = () => {
    getAllPokemons(page, 12) // 12 Pokémon par page
      .then((data) => {
        if (data) {
          setPokemons(data.pokemons);
          setTotalPages(data.totalPages);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des Pokémon paginés :", error);
      });
  };

  const fetchAllPokemons = () => {
    getAllPokemons(1, 1000) // Charge tous les Pokémon (limite élevée)
      .then((data) => {
        if (data) {
          setAllPokemons(data.pokemons);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de tous les Pokémon :", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Supprime le token JWT
    navigate('/login'); // Redirige vers la page de connexion
  };

  // Filtrer les Pokémon en fonction de la recherche et du type
  const filteredPokemons = allPokemons.filter((pokemon) => {
    const matchesSearchTerm = pokemon.name.french.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || pokemon.type.includes(selectedType);
    return matchesSearchTerm && matchesType;
  });

  // Appliquer la pagination sur les Pokémon filtrés
  const paginatedPokemons = filteredPokemons.slice((page - 1) * 12, page * 12);

  const uniqueTypes = [...new Set(allPokemons.flatMap((pokemon) => pokemon.type))];

  const handleNextPage = () => {
    if (page < Math.ceil(filteredPokemons.length / 12)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
      <button className="logout-button" onClick={handleLogout}>
        Déconnexion
      </button>
      {userRole === "admin" && (
      <button className="add-pokemon-button" onClick={() => navigate('/add-pokemon')}>
        Ajouter un Pokémon
      </button>
      )}
      <h1>Pokedex Régional</h1>
      <input
        type="text"
        placeholder="Rechercher un Pokémon"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <br />
      <br />
      <select value={selectedType} onChange={handleTypeChange}>
        <option value="">Tous les types</option>
        {uniqueTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      <br />
      <br />
      <div className="grid-container">
        {paginatedPokemons.map((pokemon, index) => (
          <span key={index}><CartePok pokemon={pokemon} /></span>
        ))}
      </div>
      <br />
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>Précédent</button>
        <span>Page {page} sur {Math.ceil(filteredPokemons.length / 12)}</span>
        <button onClick={handleNextPage} disabled={page === Math.ceil(filteredPokemons.length / 12)}>Suivant</button>
      </div>
    </>
  );
}

export default App;