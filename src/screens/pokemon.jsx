import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getPokemonById } from "../services/api";
import CartePok from "../components/cartePok/cartePok";

const Pokemon = () => {
    const { id } = useParams();
    // const history = useHistory();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        getPokemonById(id).then((data) => {
            if (data) {
                setPokemon(data);
            }
        }).catch((error) => {
            console.error("There was an error fetching the pokemons!", error);
        });
    }, [id]);

    if (!pokemon) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <span><CartePok pokemon={pokemon} /></span>
        </div>
    );
}

export default Pokemon;