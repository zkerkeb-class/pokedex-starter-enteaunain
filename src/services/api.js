import axios from 'axios';

const getAllPokemons = () => {
    return axios({
        method: "GET",
        url: "http://localhost:3000/api/pokemons",
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.error("There was an error fetching the pokemons!", error);
    });
};


const getPokemonById = ({id}) => {
  axios({
    method: "GET",
    url: `http://localhost:3000/api/pokemons/${id}`,
  }).then((response) => {
    return response.data;
  })
};

const getTypes = () => {
  axios({
    method: "GET",
    url: "http://localhost:3000/api/pokemons/types",
  }).then((response) => {
    return response.data;
  })
};

const createPokemon = (pokemon) => {
  axios({
    method: "POST",
    url: "http://localhost:3000/api/pokemons",
    body: pokemon,
  }).then((response) => {
    return response.data;
  })
};

const updatePokemon = (pokemon, id) => {
  axios({
    method: "PUT",
    url: `http://localhost:3000/api/pokemons/${id}`,
    body: pokemon,
  }).then((response) => {
    return response.data;
  })
};

const deletePokemon = (id) => {
  axios({
    method: "DELETE",
    url: `http://localhost:3000/api/pokemons/${id}`,
  }).then((response) => {
    return response.data;
  })
}

export { getAllPokemons, getPokemonById, getTypes, createPokemon, updatePokemon, deletePokemon };