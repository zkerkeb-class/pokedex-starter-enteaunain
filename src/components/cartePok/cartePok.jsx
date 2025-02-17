import './index.css'

const CartePok = ({pokemon}) => {

    const getTypeInfo = (type, infoType = 'color') => {
        const typeColors = {
            'Fire': '#F5A582',
            'Water': '#A0C8F0',
            'Grass': '#A8E080',
            'Electric': '#FBE870',
            'Ice': '#C0E8E8',
            'Fighting': '#E08070',
            'Poison': '#C080C0',
            'Ground': '#F0D8A0',
            'Flying': '#C8B0F0',
            'Psychic': '#F8A8B8',
            'Bug': '#C8D850',
            'Rock': '#D8C080',
            'Ghost': '#A890C8',
            'Dark': '#A89080',
            'Dragon': '#A890F8',
            'Steel': '#D8D8E0',
            'Fairy': '#F4C0C8',
            'Normal': '#D0D0A8'
        };
    
        const typeImages = {
            'Fire': 'src/assets/types/fire.png',
            'Water': 'src/assets/types/water.png',
            'Grass': 'src/assets/types/grass.png',
            'Electric': 'src/assets/types/electric.png',
            'Ice': 'src/assets/types/ice.png',
            'Fighting': 'src/assets/types/fighting.png',
            'Poison': 'src/assets/types/poison.png',
            'Ground': 'src/assets/types/ground.png',
            'Flying': 'src/assets/types/flying.png',
            'Psychic': 'src/assets/types/psychic.png',
            'Bug': 'src/assets/types/bug.png',
            'Rock': 'src/assets/types/rock.png',
            'Ghost': 'src/assets/types/ghost.png',
            'Dark': 'src/assets/types/dark.png',
            'Dragon': 'src/assets/types/dragon.png',
            'Steel': 'src/assets/types/steel.png',
            'Fairy': 'src/assets/types/fairy.png',
            'Normal': 'src/assets/types/normal.png'
        };
    
        if (infoType === 'color') {
            return typeColors[type] || typeColors['Normal'];
        } else if (infoType === 'image') {
            return typeImages[type] || typeImages['Normal'];
        }
    };
        
    const backgroundColor = getTypeInfo(pokemon.type[0], 'color');
    const typeImage = getTypeInfo(pokemon.type[0], 'image');

    return (
        <div className='pokemon-card'>
                <div className='pokemon-card-background' style={{ backgroundColor }}>
                    <div className='pokemon-card-header'>
                        <span className='pokemon-card-title'>&nbsp;{pokemon.name.french}</span>
                        <span className='pokemon-card-pv'>{pokemon.base.HP} HP&nbsp;</span>
                        <img src={typeImage} style={{ width: '20px', height: '20px', marginRight: '2%'}} />
                    </div>
                    <div className='pokemon-card-image-back'>
                        <div className='pokemon-card-image-contour'>
                            <div className='pokemon-card-image-contour-2'>
                            <img src={pokemon.image} style={{height:160}} alt={pokemon.name.french}></img>
                            </div>
                        </div>   
                    </div>
                    <div className='pokemon-card-stat'>
                        <div className='pokemon-stat-title'>
                            <span>&nbsp;Attaque</span>
                            <span><br></br>&nbsp;Défense</span>
                            <span><br></br>&nbsp;Attaque Spé.</span>
                            <span><br></br>&nbsp;Défense Spé.</span>
                            <span><br></br>&nbsp;Vitesse</span>
                        </div>
                        <div className='pokemon-stat-value'>
                            <span>{pokemon.base.Attack}</span>
                            <span><br></br>{pokemon.base.Defense}</span>
                            <span><br></br>{pokemon.base["Sp. Attack"]}</span>
                            <span><br></br>{pokemon.base["Sp. Defense"]}</span>
                            <span><br></br>{pokemon.base.Speed}</span>
                        </div>
                    </div>
                    <div className='pokemon-card-id'>
                        <span>{pokemon.id}/152&nbsp;</span>
                    </div>
                </div>
        </div>

        
    )
} 

export default CartePok

