import './index.css'

const CartePok = ({pokemon}) => {

    const getTypeColor = (type) => {
        switch (type) {
            case 'Fire':
                return '#F08030';
            case 'Water':
                return '#6890F0';
            case 'Grass':
                return '#78C850';
            case 'Electric':
                return '#F8D030';
            case 'Ice':
                return '#98D8D8';
            case 'Fighting':
                return '#C03028';
            case 'Poison':
                return '#A040A0';
            case 'Ground':
                return '#E0C068';
            case 'Flying':
                return '#A890F0';
            case 'Psychic':
                return '#F85888';
            case 'Bug':
                return '#A8B820';
            case 'Rock':
                return '#B8A038';
            case 'Ghost':
                return '#705898';
            case 'Dark':
                return '#705848';
            case 'Dragon':
                return '#7038F8';
            case 'Steel':
                return '#B8B8D0';
            case 'Fairy':
                return '#EE99AC';
            default:
                return '#A8A878';
        }
    };

    return (
        <div className="pokemon-card">
            
            <span><u>{pokemon.name.french}</u></span>
            <img src={pokemon.image} style={{height:180}} alt={pokemon.name.french} />

            <div className="pokemon-type-container">
            {pokemon.type.map((type, index) => {
                return <span style={{ backgroundColor: getTypeColor(type) }} key={type}>{type}</span>;
            })}
            </div>
            <span className='pokemon-stat'>Attaque: {pokemon.base.Attack}, <br/>Défense: {pokemon.base.Defense}, <br/>HP: {pokemon.base.HP}, <br/>Attaque Spé.: {pokemon.base["Sp. Attack"]}, <br/>Défense Spé.: {pokemon.base["Sp. Defense"]}, <br/>Vitesse: {pokemon.base.Speed}</span>
        </div>
    )
} 

export default CartePok