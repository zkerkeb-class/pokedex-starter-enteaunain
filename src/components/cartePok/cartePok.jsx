const CartePok = ({pokemon}) => {

    return (
        <div className="card">
            <img src={pokemon.image} style={{height:180}} alt={pokemon.name.french} />
            <h2><u>{pokemon.name.french}</u></h2>
            <p>
            {pokemon.type.map((type, index) => (
                <span key={index}>{type}{index < pokemon.type.length - 1 ? ', ' : ''}</span>
            ))}
            </p>
            <p>Attaque: {pokemon.base.Attack}, <br/>Défense: {pokemon.base.Defense}, <br/>HP: {pokemon.base.HP}, <br/>Attaque Spé.: {pokemon.base["Sp. Attack"]}, <br/>Défense Spé.: {pokemon.base["Sp. Defense"]}, <br/>Vitesse: {pokemon.base.Speed}</p>
        </div>
    )
} 

export default CartePok