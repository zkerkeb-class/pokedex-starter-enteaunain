import axios from 'axios';

const getAllPokemons = (page = 1, limit = 12) => {
  return axios({
    method: "GET",
    url: `http://localhost:3000/api/pokemons?page=${page}&limit=${limit}`,
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    console.error("There was an error fetching the pokemons!", error);
  });
};


const getPokemonById = (id) => {
  return axios({
    method: "GET",
    url: `http://localhost:3000/api/pokemons/${id}`,
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    console.error(`There was an error fetching the pokemon with id ${id}!`, error);
  });
};

const getTypes = () => {
  return axios({
    method: "GET",
    url: "http://localhost:3000/api/pokemons/types",
  }).then((response) => {
    return response.data;
  })
};

const createPokemon = (pokemon) => {
  return axios({
    method: "POST",
    url: "http://localhost:3000/api/pokemons",
    data: pokemon,
  }).then((response) => {
    return response.data;
  })
};

const updatePokemon = (pokemon, id) => {
  return axios({
    method: "PUT",
    url: `http://localhost:3000/api/pokemons/${id}`,
    data: pokemon,
  }).then((response) => {
    return response.data;
  })
};

const deletePokemon = (id) => {
  return axios({
    method: "DELETE",
    url: `http://localhost:3000/api/pokemons/${id}`,
  }).then((response) => {
    return response.data;
  })
}

const login = (email, password) => {
  return axios({
    method: "POST",
    url: "http://localhost:3000/api/auth/login",
    data: { email, password },
  }).then((response) => {
    return response.data;
  })
};

const register = (email, name, password) => {
  return axios({
    method: "POST",
    url: "http://localhost:3000/api/auth/register",
    data: { email, name, password },
  }).then((response) => {
    return response.data;
  })
};

export { getAllPokemons, getPokemonById, getTypes, createPokemon, updatePokemon, deletePokemon, login, register };