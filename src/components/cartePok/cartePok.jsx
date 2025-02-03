import pokemons from "../../assets/pokemons"

const cartePok = ({count}) => {
    console.log(count)
    if (count === 0) {
        return (
            <div>
                <p>Le compteur est à 0</p>
            </div>
        )
    }
    else if (count > 0 && count <= 152){
        const pokemon = pokemons[count - 1]
        console.log(pokemon)
        return (
        <div className="card">
            <img src={pokemon.image} style={{height:180}} alt={pokemon.name.french} />
            <h2>{pokemon.name.french}</h2>
            <p>ID: {pokemon.id}</p>
            <p>Type majoritaire: {pokemon.type[0]}</p>
            <p>Attaque: {pokemon.base.Attack}, <br/>Défense: {pokemon.base.Defense}, <br/>HP: {pokemon.base.HP}, <br/>Attaque Spé.: {pokemon.base["Sp. Attack"]}, <br/>Défense Spé.: {pokemon.base["Sp. Defense"]}, <br/>Vitesse: {pokemon.base.Speed}</p>
        </div>
    )
    }
    
}

export default cartePok