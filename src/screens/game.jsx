import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './game.css';
import { getPokemonById, setScore, getScore } from '/src/services/api';

const Game = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [pokemonName, setPokemonName] = useState('');
    const navigate = useNavigate();
    const scoreRef = useRef(0);
    const [userScore, setUserScore] = useState(0);
    const [pokemonImageLoaded, setPokemonImageLoaded] = useState(false);

    let animationFrameId;

    // Définir les images des obstacles et leurs types
    const obstacleImages = [
        { src: '/src/assets/obstacles/masterball.png', type: 'smallSquare' },
        { src: '/src/assets/obstacles/pokeball.png', type: 'smallSquare' },
        { src: '/src/assets/obstacles/team-rocket.png', type: 'largeSquare' },
        { src: '/src/assets/obstacles/ondine.png', type: 'rectangle' },
        { src: '/src/assets/obstacles/sacha.png', type: 'rectangle' },
    ];

    // Musique
    const gameMusic = new Audio('/src/assets/music/1.mp3');
    gameMusic.loop = true;
    gameMusic.volume = 0.1;

    // Badges
    const badgeImages = [
        '/src/assets/badges/ame.png',
        '/src/assets/badges/cascade.png',
        '/src/assets/badges/foudre.png',
        '/src/assets/badges/prisme.png',
        '/src/assets/badges/roche.png',
        '/src/assets/badges/terre.png',
        '/src/assets/badges/volcan.png',
    ];
    
    const badges = badgeImages.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
    });

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await getScore();
                setUserScore(response.score || 0);
            } catch (error) {
                console.error("Erreur lors de la récupération du score :", error);
            }
        };
        fetchScore();
    }, []);

    const updateHighScore = async () => {
        if (scoreRef.current > userScore) {
            try {
                await setScore(scoreRef.current);
            } catch (error) {
                console.error("Erreur lors de la mise à jour du highscore :", error);
            }
        }
    };

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            if (!pokemonImageLoaded) {
                console.error('[Image] Timeout - Le chargement de l\'image a pris trop de temps');
            }
        }, 5000);
    
        return () => clearTimeout(loadingTimeout);
    }, [pokemonImageLoaded]);
    
    useEffect(() => {
        console.log('[Game] Initialisation du composant - Chargement des données du Pokémon');
        getPokemonById(id).then((data) => {
            console.log(`[Pokemon] Données chargées pour ${data.name.french}`);
            setPokemonName(data.name.french);
            
            const img = new Image();
            img.src = data.image;
            img.onload = () => {
                console.log('[Image] Image du Pokémon chargée avec succès');
                setImageUrl(data.image);
                setPokemonImageLoaded(true);
            };
            img.onerror = () => {
                console.error('[Image] Erreur de chargement de l\'image du Pokémon');
                setPokemonImageLoaded(false);
            };
        }).catch((error) => {
            console.error("[Pokemon] Erreur lors du chargement:", error);
        });
    }, [id]);
    
    useEffect(() => {
        if (!pokemonImageLoaded) {
            console.log('[Image] En attente du chargement de l\'image du Pokémon');
            return;
        }
        
        console.log('[Game] Tous les éléments sont chargés - Démarrage du jeu');

        gameMusic.play().catch(error => {
            console.error('[Musique] Erreur de lecture:', error);
        });

        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            console.error('[Canvas] Élément canvas non trouvé');
            return;
        }

        const ctx = canvas.getContext('2d');

        // Variables du jeu
        let isJumping = false;
        let canJump = true;
        let jumpHeight = 0;
        let jumpDirection = 1;
        let jumpDuration = 0; 
        let maxJumpDuration = 43;
        let obstacles = [];
        let maxObstacles = 2;
        let gameSpeed = 1;
        const groundHeight = 50;
        const pokemonImage = new Image();
        pokemonImage.src = imageUrl;

        // Animation de marche
        let walkCycle = 0;
        let walkDirection = 1;
        const maxWalkCycle = 20;
        let walkAngle = 0;
        const maxWalkAngle = 10; // Degrés de rotation pour l'animation de marche

        let grassBlades = [];
        const grassBladeCount = 300;

        // Initialisation des brins d'herbe
        for (let i = 0; i < grassBladeCount; i++) {
            grassBlades.push({
                x: Math.random() * 1200,
                y: 600 - groundHeight + Math.random() * 10,
                length: 10 + Math.random() * 10,
                curve: Math.random() * 10 + 5,
                speed: 5,
            });
        }

        const updateScore = () => {
            scoreRef.current += 1;
        };
        
        const drawScore = () => {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'black';
            const text = `Score: ${scoreRef.current}`;
            const textWidth = ctx.measureText(text).width;
            const canvasCenterX = canvas.width / 2;
            ctx.fillText(text, canvasCenterX - textWidth / 2, 30);
            drawBadges(ctx, scoreRef.current, userScore);
        };

        const drawBadges = (ctx, score, userScore) => {
            const thresholds = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
            const badgeSize = 40;
            const startX = canvas.width / 2 - (badgeSize * thresholds.length) / 2;
            const y = 60;
        
            thresholds.forEach((threshold, index) => {
                const isUnlocked = score >= threshold || userScore >= threshold;
                ctx.filter = isUnlocked ? 'none' : 'grayscale(100%)';
                ctx.drawImage(badges[index], startX + index * (badgeSize + 10), y, badgeSize, badgeSize);
            });
            ctx.filter = 'none';
        };

        const drawPokemon = () => {
            // Mise à jour de l'animation de marche
            walkCycle += walkDirection;
            if (walkCycle >= maxWalkCycle || walkCycle <= 0) {
                walkDirection *= -1;
            }
            
            // Calcul de l'angle de balancement en fonction du cycle de marche
            walkAngle = (walkCycle / maxWalkCycle) * maxWalkAngle;
            
            ctx.save();
            // Positionne le point de rotation au centre bas du Pokémon
            ctx.translate(150, 550 - jumpHeight - groundHeight);
            ctx.rotate(walkAngle * Math.PI / 180);
            
            // Dessine le Pokémon avec l'offset de rotation
            ctx.drawImage(
                pokemonImage, 
                -50, // Compensation pour la rotation
                -50, // Compensation pour la rotation
                100, 
                100
            );
            
            ctx.restore();
        };

        const drawGround = () => {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 600 - groundHeight, 1200, groundHeight);
        };

        const drawObstacles = () => {
            obstacles.forEach((obstacle) => {
                if (!obstacle.image.complete) return;

                if (obstacle.type === 'largeSquare' && obstacle.image.src.includes('team-rocket')) {
                    ctx.drawImage(
                        obstacle.image,
                        obstacle.x,
                        600 - groundHeight - obstacle.height * 1.2,
                        obstacle.width * 1.3,
                        obstacle.height * 1.3
                    );
                } else if (obstacle.type === 'rectangle') {
                    ctx.drawImage(
                        obstacle.image,
                        obstacle.x,
                        600 - groundHeight - obstacle.height,
                        obstacle.width * 1.4,
                        obstacle.height * 1
                    );
                } else {
                    ctx.drawImage(
                        obstacle.image,
                        obstacle.x,
                        600 - groundHeight - obstacle.height,
                        obstacle.width,
                        obstacle.height
                    );
                }
            });
        };

        const drawGrass = () => {
            ctx.strokeStyle = '#04b419';
            ctx.lineWidth = 2;
        
            grassBlades.forEach((blade) => {
                ctx.beginPath();
                ctx.moveTo(blade.x, blade.y);
                ctx.quadraticCurveTo(
                    blade.x + blade.curve,
                    blade.y - blade.length / 2,
                    blade.x,
                    blade.y - blade.length
                );
                ctx.stroke();
        
                blade.x -= blade.speed;
        
                if (blade.x < 0) {
                    blade.x = 1200;
                    blade.y = 600 - groundHeight + Math.random() * 10;
                    blade.length = 10 + Math.random() * 10;
                    blade.curve = Math.random() * 10 + 5;
                }
            });
        };

        const updateObstacles = () => {
            obstacles = obstacles.map((obstacle) => ({
                ...obstacle,
                x: obstacle.x - 5 * gameSpeed,
            })).filter((obstacle) => obstacle.x + obstacle.width > 0);

            if (obstacles.length < maxObstacles) {
                const randomObstacle = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
                const obstacleImage = new Image();
                obstacleImage.src = randomObstacle.src;

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

                const newObstacleX = 1200;
                const newObstacle = {
                    x: newObstacleX,
                    width,
                    height,
                    image: obstacleImage,
                    type: randomObstacle.type
                };

                const isOverlapping = obstacles.some((obstacle) => {
                    return (
                        newObstacle.x < obstacle.x + obstacle.width + 400 &&
                        newObstacle.x + newObstacle.width + 400 > obstacle.x
                    );
                });

                if (!isOverlapping) {
                    obstacles.push(newObstacle);
                }
            }
        };

        let isGameOver = false;

        const checkCollision = () => {
            if (isGameOver) return;
        
            const pokemonHitbox = {
                x: 100,
                y: 500 - jumpHeight - groundHeight,
                width: 100,
                height: 100,
            };
        
            obstacles.forEach((obstacle) => {
                let obstacleHitboxY = 600 - groundHeight - obstacle.height;
                let obstacleHitboxWidth = obstacle.width;
        
                if (obstacle.type === 'largeSquare') {
                    obstacleHitboxY += 30;
                    obstacleHitboxWidth -= 140;
                } else if (obstacle.type === 'rectangle') {
                    obstacleHitboxY += 50;
                    obstacleHitboxWidth -= 110;
                }
        
                if (
                    pokemonHitbox.x < obstacle.x + obstacleHitboxWidth &&
                    pokemonHitbox.x + pokemonHitbox.width > obstacle.x &&
                    pokemonHitbox.y < obstacleHitboxY + obstacle.height &&
                    pokemonHitbox.y + pokemonHitbox.height > obstacleHitboxY
                ) {
                    isGameOver = true;
                    updateHighScore();
                    cancelAnimationFrame(animationFrameId);
                    window.removeEventListener('keydown', handleKeyDown);
                    gameMusic.pause();
                    gameMusic.currentTime = 0;
                    alert('Game Over!');
                    window.location.reload();
                }
            });
        };

        const handleKeyDown = (e) => {
            if (e.code === 'Space' && canJump) {
                isJumping = true;
                canJump = false;
                jumpDuration = 0;
            }
        };

        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                jumpDirection = -1;
            }
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isJumping) {
                if (jumpDirection === 1 && jumpDuration < maxJumpDuration) {
                    jumpHeight += 8;
                    jumpDuration += 1.2;
                } else {
                    jumpDirection = -1;
                }

                if (jumpDirection === -1) {
                    jumpHeight -= 8;
                    if (jumpHeight <= 0) {
                        jumpHeight = 0;
                        isJumping = false;
                        canJump = true;
                        jumpDirection = 1;
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

            gameSpeed += 0.0001;
            animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        gameLoop();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            gameMusic.pause();
            gameMusic.currentTime = 0;
        };
    }, [pokemonImageLoaded]);

    const handleBackClick = () => {
        navigate(`/pokemon/${id}`, {replace: true});
    };

    return (
        <div>
            <button className="back-button" onClick={handleBackClick}>
                Retour
            </button>
            <div className="score-container">
                Highscore : {userScore}
            </div>
            <h1>Vous jouez avec {pokemonName}</h1>
            <canvas id="gameCanvas" width="1200" height="600" style={{ border: '1px solid black' }}></canvas>
            <p>Appuyez sur la barre d'espace pour sauter !</p>
        </div>
    );
};

export default Game;