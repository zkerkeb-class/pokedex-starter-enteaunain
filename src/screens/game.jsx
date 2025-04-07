import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './game.css';
import { getPokemonById } from '/src/services/api';

const Game = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [pokemonName, setPokemonName] = useState('');
    const navigate = useNavigate();
    let score = 0;

    let animationFrameId;

    // Définir les images des obstacles et leurs types
    const obstacleImages = [
        { src: '/src/assets/obstacles/masterball.png', type: 'smallSquare' },
        { src: '/src/assets/obstacles/pokeball.png', type: 'smallSquare' },
        { src: '/src/assets/obstacles/team-rocket.png', type: 'largeSquare' },
        { src: '/src/assets/obstacles/ondine.png', type: 'rectangle' },
        { src: '/src/assets/obstacles/sacha.png', type: 'rectangle' },
    ];

    useEffect(() => {
        // Ajoute une classe spécifique au body pour désactiver le scroll
        document.body.classList.add('no-scroll');

        // Nettoyage : Supprime la classe lorsque le composant est démonté
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    useEffect(() => {
        // Récupérer les données du Pokémon
        getPokemonById(id).then((data) => {
            setImageUrl(data.image); // Met à jour l'image URL
            setPokemonName(data.name.french);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des données du Pokémon :", error);
        });
    }, [id]);

    useEffect(() => {
        if (!imageUrl) return; // Attendre que l'image soit définie

        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        let isJumping = false;
        let canJump = true;
        let jumpHeight = 0;
        let jumpDirection = 1;
        let jumpDuration = 0; 
        let maxJumpDuration = 43;
        let obstacles = [];
        let maxObstacles = 2;
        const groundHeight = 50;
        const pokemonImage = new Image();
        pokemonImage.src = imageUrl;

        let grassBlades = [];
        const grassBladeCount = 300;

        const updateScore = () => {
            score += 1; // Incrémente le score à chaque frame
        };
        
        const drawScore = () => {
            ctx.font = '20px Arial'; // Police et taille du texte
            ctx.fillStyle = 'black'; // Couleur du texte
        
            // Calcule la position horizontale pour centrer le texte
            const text = `Score: ${score}`;
            const textWidth = ctx.measureText(text).width;
            const canvasCenterX = canvas.width / 2;
        
            ctx.fillText(text, canvasCenterX - textWidth / 2, 30); // Affiche le texte centré en haut
        };

        // Initialisation des brins d'herbe
        for (let i = 0; i < grassBladeCount; i++) {
            grassBlades.push({
                x: Math.random() * 1200, // Position horizontale aléatoire
                y: 600 - groundHeight + Math.random() * 10, // Position verticale proche du sol
                length: 10 + Math.random() * 10, // Longueur aléatoire
                curve: Math.random() * 10 + 5, // Courbure aléatoire
                speed: 5,
            });
}

        const drawPokemon = () => {
            ctx.drawImage(pokemonImage, 100, 500 - jumpHeight - groundHeight, 100, 100);
        };

        const drawGround = () => {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 600 - groundHeight, 1200, groundHeight); // Dessine le sol
        };

        const drawObstacles = () => {
            obstacles.forEach((obstacle) => {

                console.log('Image dimensions:', {
                    src: obstacle.image.src,
                    naturalWidth: obstacle.image.naturalWidth,
                    naturalHeight: obstacle.image.naturalHeight,
                });

                if (obstacle.image.complete) { // Vérifie si l'image est chargée
                    if (obstacle.type === 'largeSquare' && obstacle.image.src.includes('team-rocket')) {
                        // console.log('Drawing team-rocket with larger dimensions');
                        ctx.drawImage(
                            obstacle.image,
                            obstacle.x,
                            600 - groundHeight - obstacle.height * 1.2,
                            obstacle.width * 1.3,
                            obstacle.height * 1.3
                        );
                    } else if (obstacle.type === 'rectangle') {
                        // console.log('Drawing rectangle obstacle');
                        ctx.drawImage(
                            obstacle.image,
                            obstacle.x,
                            600 - groundHeight - obstacle.height,
                            obstacle.width * 1.4,
                            obstacle.height * 1
                        );
                    } else {
                        // console.log('Drawing default obstacle');
                        ctx.drawImage(
                            obstacle.image,
                            obstacle.x,
                            600 - groundHeight - obstacle.height,
                            obstacle.width,
                            obstacle.height
                        );
                    }
                } else {
                    console.log('Image not loaded:', obstacle.image.src);
                }
            });
        };

        const drawGrass = () => {
            ctx.strokeStyle = '#04b419'; // Couleur des brins d'herbe
            ctx.lineWidth = 2; // Épaisseur des brins
        
            grassBlades.forEach((blade) => {
                ctx.beginPath();
                ctx.moveTo(blade.x, blade.y); // Point de départ du brin
                ctx.quadraticCurveTo(
                    blade.x + blade.curve, // Point de contrôle pour la courbure
                    blade.y - blade.length / 2, // Position intermédiaire
                    blade.x, // Point final
                    blade.y - blade.length // Position finale
                );
                ctx.stroke();
        
                // Déplace le brin vers la gauche
                blade.x -= blade.speed;
        
                // Réinitialise le brin s'il sort de l'écran
                if (blade.x < 0) {
                    blade.x = 1200; // Réapparaît à droite
                    blade.y = 600 - groundHeight + Math.random() * 10; // Nouvelle position verticale
                    blade.length = 10 + Math.random() * 10; // Nouvelle longueur
                    blade.curve = Math.random() * 10 + 5; // Nouvelle courbure
                }
            });
        };

        const updateObstacles = () => {
            // Déplace les obstacles existants
            obstacles = obstacles.map((obstacle) => ({
                ...obstacle,
                x: obstacle.x - 5, // Déplace les obstacles vers la gauche
            })).filter((obstacle) => obstacle.x + obstacle.width > 0); // Supprime les obstacles hors écran

            // Ajouter un nouvel obstacle si le nombre d'obstacles est inférieur à la limite
            if (obstacles.length < maxObstacles) {
                const randomObstacle = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
                const obstacleImage = new Image();
                obstacleImage.src = randomObstacle.src;

                // Définir les dimensions en fonction du type d'obstacle
                let width, height;
                if (randomObstacle.type === 'smallSquare') {
                    width = 80;
                    height = 80;
                } else if (randomObstacle.type === 'largeSquare') {
                    width = 90;
                    height = 100;
                } else if (randomObstacle.type === 'rectangle') {
                    width = 40;
                    height = 150;
                }

                // Générer une position pour le nouvel obstacle
                const newObstacleX = 1200; // Position initiale à droite de l'écran
                const newObstacle = {
                    x: newObstacleX,
                    width,
                    height,
                    image: obstacleImage,
                    type: randomObstacle.type
                };

                // Vérifier si le nouvel obstacle chevauche un obstacle existant
                const isOverlapping = obstacles.some((obstacle) => {
                    return (
                        newObstacle.x < obstacle.x + obstacle.width + 400 &&
                        newObstacle.x + newObstacle.width + 400 > obstacle.x
                    );
                });

                // Ajouter le nouvel obstacle uniquement s'il ne chevauche pas un autre obstacle
                if (!isOverlapping) {
                    obstacles.push(newObstacle);
                }
            }
        };

        let isGameOver = false;

        const checkCollision = () => {
            if (isGameOver) return;
        
            // Définir la hitbox du Pokémon
            const pokemonHitbox = {
                x: 100, // Position horizontale fixe du Pokémon
                y: 500 - jumpHeight - groundHeight, // Position verticale du Pokémon
                width: 100, // Largeur de la hitbox
                height: 100, // Hauteur de la hitbox
            };
        
            obstacles.forEach((obstacle) => {
                // Ajuster la position verticale et la largeur de la hitbox en fonction du type d'obstacle
                let obstacleHitboxY = 600 - groundHeight - obstacle.height;
                let obstacleHitboxWidth = obstacle.width; // Par défaut, la largeur de la hitbox est égale à la largeur de l'obstacle
        
                if (obstacle.type === 'largeSquare') {
                    obstacleHitboxY += 30; // Décale la hitbox vers le bas pour les grands carrés
                    obstacleHitboxWidth -= 140; // Réduit la largeur de la hitbox des grands carrés
                } else if (obstacle.type === 'rectangle') {
                    obstacleHitboxY += 50; // Décale la hitbox vers le bas pour les rectangles
                    obstacleHitboxWidth -= 110; // Réduit la largeur de la hitbox des rectangles
                }
        
                // Vérifiez si les hitboxs se chevauchent
                if (
                    pokemonHitbox.x < obstacle.x + obstacleHitboxWidth &&
                    pokemonHitbox.x + pokemonHitbox.width > obstacle.x &&
                    pokemonHitbox.y < obstacleHitboxY + obstacle.height &&
                    pokemonHitbox.y + pokemonHitbox.height > obstacleHitboxY
                ) {
                    console.log('Collision détectée !');
                    isGameOver = true;
                    alert('Game Over!');
                    window.location.reload();
                }
            });
        };

        const handleKeyDown = (e) => {
            if (e.code === 'Space' && canJump) {
                isJumping = true;
                canJump = false; // Désactive la possibilité de sauter jusqu'à ce que le Pokémon touche le sol
                jumpDuration = 0; // Réinitialise la durée du saut
            }
        };

        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                jumpDirection = -1; // Commence la descente lorsque la barre d'espace est relâchée
            }
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isJumping) {
                if (jumpDirection === 1 && jumpDuration < maxJumpDuration) {
                    jumpHeight += 8; // Monte plus haut
                    jumpDuration += 1.2; // Incrémente la durée du saut
                } else {
                    jumpDirection = -1; // Commence la descente
                }

                if (jumpDirection === -1) {
                    jumpHeight -= 8; // Descend
                    if (jumpHeight <= 0) {
                        jumpHeight = 0; // Revient au sol
                        isJumping = false; // Termine le saut
                        canJump = true; // Réactive la possibilité de sauter
                        jumpDirection = 1; // Réinitialise la direction pour le prochain saut
                    }
                }
            }

            drawGround();
            drawGrass();
            drawObstacles();
            drawPokemon();
            updateObstacles();
            updateScore();
            drawScore();
            checkCollision();

            animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        window.addEventListener('keydown', handleKeyDown);
        gameLoop();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            obstacles = [];
        };
    }, [imageUrl]);

    const handleBackClick = () => {
        navigate(`/pokemon/${id}`, {replace: true}); // Retourne à la page précédente
    };

    return (
        <div>
            <button className="back-button" onClick={handleBackClick}>
                Retour
            </button>
            <h1>Vous jouez avec {pokemonName}</h1>
            <canvas id="gameCanvas" width="1200" height="600" style={{ border: '1px solid black' }}></canvas>
            <p>Appuyez sur la barre d'espace pour sauter !</p>
        </div>
    );
};

export default Game;