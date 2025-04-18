import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getPokemonById, updatePokemon, deletePokemon } from "/src/services/api";
import CartePok from "../components/cartePok/cartePok";
import './pokemon.css';
import { jwtDecode } from "jwt-decode";

const Pokemon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // États locaux pour les champs du formulaire
    const [name, setName] = useState("");
    const [hp, setHp] = useState("");
    const [attack, setAttack] = useState("");
    const [defense, setDefense] = useState("");
    const [specialAttack, setSpecialAttack] = useState("");
    const [specialDefense, setSpecialDefense] = useState("");
    const [speed, setSpeed] = useState("");
    const [type, setType] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Récupérer le rôle de l'utilisateur
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        // Ajoute une classe spécifique au body pour désactiver le scroll
        document.body.classList.add('no-scroll');

        // Nettoyage : Supprime la classe lorsque le composant est démonté
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    useEffect(() => {
        // Simule une requête pour récupérer les données du Pokémon
        getPokemonById(id).then((data) => {
            setPokemon(data);
            // Initialisez les états locaux avec les données du Pokémon
            setName(data.name.french);
            setHp(data.stats.hp);
            setAttack(data.stats.attack);
            setDefense(data.stats.defense);
            setSpecialAttack(data.stats.specialAttack);
            setSpecialDefense(data.stats.specialDefense);
            setSpeed(data.stats.speed);
            setType(data.type.join(","));
            setImageUrl(data.image);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des données du Pokémon :", error);
        });

        // Décoder le rôle de l'utilisateur depuis le token JWT
        const token = localStorage.getItem("jwtToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Décoder le token
                setUserRole(decodedToken.role); // Récupérer le rôle depuis le payload
            } catch (error) {
                console.error("Erreur lors du décodage du token JWT :", error);
            }
        }
    }, [id]);

    const handleModifyClick = () => {
        setIsEditing((prevIsEditing) => !prevIsEditing); // Bascule entre true et false
    };

    const handleApplyClick = () => {
        // Récupération des données du formulaire
        const updatedPokemon = {
            name: {
                english: pokemon.name.english,
                japanese: pokemon.name.japanese,
                chinese: pokemon.name.chinese,
                french: name,
            },
            stats: {
                hp: parseInt(hp, 10),
                attack: parseInt(attack, 10),
                defense: parseInt(defense, 10),
                specialAttack: parseInt(specialAttack, 10),
                specialDefense: parseInt(specialDefense, 10),
                speed: parseInt(speed, 10),
            },
            id: pokemon.id,
            type: type.split(","), // Convertit une chaîne en tableau
            image: imageUrl,
        };

        console.log(updatedPokemon)
    
        // Appel à l'API pour mettre à jour le Pokémon
        updatePokemon(updatedPokemon, updatedPokemon.id)
            .then((response) => {
            console.log("Réponse de l'API :", response);
            alert("Pokémon mis à jour avec succès !");
            window.location.reload(); // Recharge la page pour afficher les nouvelles données
            })
            .catch((error) => {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Erreur lors de la mise à jour du Pokémon.");
            });
    };

    const handleDeleteClick = () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce Pokémon ?")) {
            deletePokemon(pokemon.id)
                .then(() => {
                    alert("Pokémon supprimé avec succès !");
                    window.location.href = "/"; // Redirige vers la page d'accueil
                })
                .catch((error) => {
                    console.error("Erreur lors de la suppression :", error);
                    alert("Erreur lors de la suppression du Pokémon.");
                });
        }
    }

    const handleBackClick = () => {
        navigate("/", {replace: true}); // Retourne à la page précédente
    };

    const handlePlayGameClick = () => {
        navigate(`/game/${pokemon.id}`); // Redirige vers la page du jeu avec l'ID du Pokémon
    };

    if (!pokemon) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`pokemon-page ${isEditing ? 'editing' : ''}`}>
            <button className="back-button" onClick={handleBackClick}>
                Retour
            </button>
            <div className="card-container">
                <span><CartePok pokemon={pokemon} /></span>
                <div className="button-container">
                    {userRole === "admin" && (
                        <>
                    <button className="modify" onClick={handleModifyClick}>Modifier</button>
                    <button className="delete" onClick={handleDeleteClick}>Supprimer</button>
                    </>
                    )}
                </div>
            </div>
            {isEditing && (
                <div className="edit-form">
                    <h3>Modifier les caractéristiques</h3>
                    <form>
                        <label>
                            Nom :
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Type (séparé par des virgules) :
                            <input
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </label>
                        <label>
                            URL de l'image :
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </label>
                        <label>
                        Points de vie (HP) :
                        <input
                            type="number"
                            value={hp}
                            onChange={(e) => setHp(e.target.value)}
                        />
                        </label>
                        <label>
                            Attaque :
                            <input
                                type="number"
                                value={attack}
                                onChange={(e) => setAttack(e.target.value)}
                            />
                        </label>
                        <label>
                            Défense :
                            <input
                                type="number"
                                value={defense}
                                onChange={(e) => setDefense(e.target.value)}
                            />
                        </label>
                        <label>
                            Attaque Spéciale :
                            <input
                                type="number"
                                value={specialAttack}
                                onChange={(e) => setSpecialAttack(e.target.value)}
                            />
                        </label>
                        <label>
                            Défense Spéciale :
                            <input
                                type="number"
                                value={specialDefense}
                                onChange={(e) => setSpecialDefense(e.target.value)}
                            />
                        </label>
                        <label>
                            Vitesse :
                            <input
                                type="number"
                                value={speed}
                                onChange={(e) => setSpeed(e.target.value)}
                            />
                        </label>
                        <button type="button" className="apply" onClick={handleApplyClick}>Appliquer</button>
                    </form>
                </div>
            )}
            <button
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                onClick={handlePlayGameClick}
            >
                Jouer avec {pokemon.name.french}
            </button>
        </div>
    );
}

export default Pokemon;