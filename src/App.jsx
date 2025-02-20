import React, { useEffect, useState } from 'react';
import CartePok from './components/cartePok/cartePok.jsx';
import './App.css';
import axios from 'axios';
import getAllPokemons from './services/api.js';

function App() {

  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    getAllPokemons().then((data) => {
      if (data) {
        setPokemons(data);
      }
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearchTerm = pokemon.name.french.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || pokemon.type.includes(selectedType);
    return matchesSearchTerm && matchesType;
  });

  const uniqueTypes = [...new Set(pokemons.flatMap(pokemon => pokemon.type))];

  return (
    <>
      <h1>Pokedex Régional</h1>
      <input
        type="text"
        placeholder="Chercher un Pokémon"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <br/>
      <br/>
      <select value={selectedType} onChange={handleTypeChange}>
        <option value="">Tous les types</option>
        {uniqueTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      <br/>
      <br/>
      <div className="grid-container">
        {filteredPokemons.map((pokemon, index) => (
          <span key={index}><CartePok pokemon={pokemon} /></span>
        ))}
      </div>
    </>
  );
}

export default App;