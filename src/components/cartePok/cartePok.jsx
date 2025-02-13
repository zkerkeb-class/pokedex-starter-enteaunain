import pokemons from "../../assets/pokemons"
import { useEffect, useState } from "react"

const CartePok = ({count}) => {

    if (count === 0 || count >= 152){
        return (
            <div>
                <p>Le compteur est à {count}</p>
            </div>
        )
    }
    else{
        let pokemon = pokemons[count - 1]
        console.log(pokemon)

        // ça c'est des states
        let [currentHp, setCurrentHp] = useState(pokemon.base.HP)

        // ensuite les useEffect
        useEffect(() => {
            if (currentHp <= 0){
                setCurrentHp(0)
                alert("Le pokémon est KO !")
            }
        }), [currentHp]

        useEffect(() => {
            alert('Le combat commence')
            setCurrentHp(pokemon.base.HP);
        }, [count])


        return (
        <div>
            <div className="card">
                <img src={pokemon.image} style={{height:180}} alt={pokemon.name.french} />
                <h2>{pokemon.name.french}</h2>
                <p>ID: {pokemon.id}</p>
                <p>Type:{" "} 
                {pokemon.type.map((type, index) => (
                    <span key={index}>{type}{index < pokemon.type.length - 1 ? ', ' : ''}</span>
                ))}
                </p>
                <p>Attaque: {pokemon.base.Attack}, <br/>Défense: {pokemon.base.Defense}, <br/>HP: {currentHp}, <br/>Attaque Spé.: {pokemon.base["Sp. Attack"]}, <br/>Défense Spé.: {pokemon.base["Sp. Defense"]}, <br/>Vitesse: {pokemon.base.Speed}</p>
            </div>
            <button onClick={() => {
                setCurrentHp(currentHp - 10)
                if (currentHp <= 0){
                    alert("Le pokémon est KO !")
                }
            }}>Attaquer</button>
        </div>
    )
    }
    
}

export default CartePok