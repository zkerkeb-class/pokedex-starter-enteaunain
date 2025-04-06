import './index.css'
import React, { useState } from 'react';
import { getAllPokemons } from '/src/services/api';

const CartePok = ({pokemon}) => {

    const [numberOfPokemons, setNumberOfPokemons] = useState(null);

    if (numberOfPokemons === null) {
        getAllPokemons().then((data) => {
            setNumberOfPokemons(data.total);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des Pokémon :", error);
        });
    }

    const getTypeInfo = (type, infoType = 'color') => {
        const typeColors = {
            'fire': '#F5A582',
            'water': '#A0C8F0',
            'grass': '#A8E080',
            'electric': '#FBE870',
            'ice': '#C0E8E8',
            'fighting': '#E08070',
            'poison': '#C080C0',
            'ground': '#F0D8A0',
            'flying': '#C8B0F0',
            'psychic': '#F8A8B8',
            'bug': '#C8D850',
            'rock': '#D8C080',
            'ghost': '#A890C8',
            'dark': '#A89080',
            'dragon': '#A890F8',
            'steel': '#D8D8E0',
            'fairy': '#F4C0C8',
            'normal': '#D0D0A8'
        };
    
        const typeImages = {
            'fire': 'http://localhost:3000/assets/types/fire.png',
            'water': 'http://localhost:3000/assets/types/water.png',
            'grass': 'http://localhost:3000/assets/types/grass.png',
            'electric': 'http://localhost:3000/assets/types/electric.png',
            'ice': 'http://localhost:3000/assets/types/ice.png',
            'fighting': 'http://localhost:3000/assets/types/fighting.png',
            'poison': 'http://localhost:3000/assets/types/poison.png',
            'ground': 'http://localhost:3000/assets/types/ground.png',
            'flying': 'http://localhost:3000/assets/types/flying.png',
            'psychic': 'http://localhost:3000/assets/types/psychic.png',
            'bug': 'http://localhost:3000/assets/types/bug.png',
            'rock': 'http://localhost:3000/assets/types/rock.png',
            'ghost': 'http://localhost:3000/assets/types/ghost.png',
            'dark': 'http://localhost:3000/assets/types/dark.png',
            'dragon': 'http://localhost:3000/assets/types/dragon.png',
            'steel': 'http://localhost:3000/assets/types/steel.png',
            'fairy': 'http://localhost:3000/assets/types/fairy.png',
            'normal': 'http://localhost:3000/assets/types/normal.png'
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
        <a href={`/pokemon/${pokemon.id}`} className='pokemon-card-link'>
            <div className='pokemon-card'>
                <div className='pokemon-card-background' style={{ backgroundColor }}>
                    <div className='pokemon-card-header'>
                        <span className='pokemon-card-title'>&nbsp;{pokemon.name.french}</span>
                        <span className='pokemon-card-pv'>{pokemon.stats.hp} HP&nbsp;</span>
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
                            <span>{pokemon.stats.attack}</span>
                            <span><br></br>{pokemon.stats.defense}</span>
                            <span><br></br>{pokemon.stats.specialAttack}</span>
                            <span><br></br>{pokemon.stats.specialDefense}</span>
                            <span><br></br>{pokemon.stats.speed}</span>
                        </div>
                    </div>
                    <div className='pokemon-card-id'>
                        <span>{pokemon.id}/{numberOfPokemons}&nbsp;</span>
                    </div>
                </div>
            </div>
        </a>
    );
} 

export default CartePok

