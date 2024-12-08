import { Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { PaperProvider } from "react-native-paper";
import { useDynamicStyles } from '@/constants/Styles';
import { useState, useEffect } from "react";
import { getPlayers } from "@/services/getPlayers"; // Service pour récupérer les joueurs
import { getChallenge } from "@/services/getChallenges"; // Service pour récupérer les défis
import { Challenge } from "@/constants/Interfaces"; // Type Challenge
import { updateBonusMalusChallenge } from "@/services/updateBonusMalusChallenge"; // Service pour mettre à jour le challenge avec un bonus ou malus

const Wheel = () => {
    const styles = useDynamicStyles(); // Récupère les styles dynamiques
    const router = useRouter(); // Utilisation du router pour la navigation
    const randomBonusMalus = Math.random() < 0.5 ? -10 : 10; // Randomisation du bonus ou malus
    const [textBonusMalus, setTextBonusMalus] = useState<string>(''); // Texte pour afficher le bonus ou malus
    const [showImage, setShowImage] = useState<boolean>(false); // Contrôle l'affichage de l'image
    const [showList, setShowList] = useState<boolean>(false); // Contrôle l'affichage de la liste des joueurs
    const [players, setPlayers] = useState<any[]>([]); // Liste des joueurs
    const [bonus, setBonus] = useState<boolean>(false); // État pour savoir si c'est un bonus
    const [malus, setMalus] = useState<boolean>(false); // État pour savoir si c'est un malus
    const [playerChallenges, setPlayerChallenges] = useState<Challenge[]>([]); // Liste des défis du joueur sélectionné
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null); // Pseudo du joueur sélectionné

    // Utilisation de useEffect pour initialiser l'état et charger les joueurs
    useEffect(() => {
        // Définit si c'est un bonus ou un malus et modifie le texte affiché
        if (randomBonusMalus === 10) {
            setTextBonusMalus("Bravo ! Tu peux donner un bonus à quelqu'un");
            setBonus(true);
        } else {
            setTextBonusMalus("Aïe ! Tu dois donner un malus à quelqu'un");
            setMalus(true);
        }

        // Affiche l'image pendant 3 secondes, puis la cache et affiche la liste des joueurs
        setShowImage(true);
        const timer = setTimeout(() => {
            setShowImage(false);
            setShowList(true);
        }, 3000);

        // Récupère la liste des joueurs
        getPlayers((sortedPlayers) => {
            setPlayers(sortedPlayers);
        });

        // Nettoyage de l'effet pour annuler le timer lors du démontage du composant
        return () => clearTimeout(timer);
    }, []);

    // Fonction appelée lorsqu'un joueur est sélectionné, récupère ses défis
    const handlePlayerClick = async (pseudo: string) => {
        const challenges = await getChallenge(pseudo);  // Récupère les défis du joueur
        setPlayerChallenges(challenges);  // Met à jour la liste des défis du joueur
        setSelectedPlayer(pseudo);  // Définit le joueur sélectionné
    };

    // Fonction appelée lorsqu'un défi est sélectionné, met à jour le statut du bonus/malus
    const handleChallengeClick = (challenge: Challenge) => {
        const statusBonusMalus = { bonus, malus }; // Prépare le statut du challenge
        updateBonusMalusChallenge(selectedPlayer!, challenge.name, statusBonusMalus);  // Met à jour le challenge dans la base de données
        router.dismissAll();  // Ferme tous les écrans modaux ou superposés
        router.push('/home');  // Redirige vers la page d'accueil
    };

    // Fonction de rendu des défis
    const renderChallenge = ({ item }: { item: Challenge }) => (
        <TouchableOpacity onPress={() => handleChallengeClick(item)}>
            <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text>{item.description}</Text>
                <Text>Reps: {item.reps}</Text>
                <Text>Muscle principal: {item.primary_muscle}</Text>
            </View>
        </TouchableOpacity>
    );

    // Fonction de rendu des joueurs
    const renderPlayer = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handlePlayerClick(item.pseudo)}>
            <View style={{ padding: 15, backgroundColor: '#d6eaff', marginVertical: 5, borderRadius: 8 }}>
                <Text style={{ color: '#007aff', fontWeight: 'bold' }}>{item.pseudo}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <PaperProvider>
            <View style={[styles.container, { alignItems: 'center' }]}>
                <Text style={styles.title}>Bonus ou Malus !</Text>

                {/* Affiche une image temporaire pendant 3 secondes */}
                {showImage && (
                    <Image 
                        source={require('@/assets/images/wheel/wheel.gif')} 
                        style={{ width: 150, height: 150 }} 
                    />
                )}

                {/* Affiche un texte selon si c'est un bonus ou un malus */}
                {!showImage && (
                    <Text style={styles.subSubtitle}>{textBonusMalus}</Text>
                )}

                {/* Affiche la liste des joueurs après l'image */}
                {showList && (
                    <FlatList
                        data={players}
                        keyExtractor={(item, index) => `${item.pseudo}_${index}`}
                        renderItem={renderPlayer}  // Utilise la fonction renderPlayer pour afficher chaque joueur
                    />
                )}

                {/* Affiche les défis du joueur sélectionné si disponibles */}
                {playerChallenges.length > 0 && (
                    <>
                        <Text style={styles.subSubtitle}>Défis pour le joueur sélectionné :</Text>
                        <FlatList
                            data={playerChallenges}
                            keyExtractor={(item, index) => `${item.name}_${index}`}
                            renderItem={renderChallenge}  // Utilise la fonction renderChallenge pour afficher chaque défi
                        />
                    </>
                )}
            </View>
        </PaperProvider>
    );
}

export default Wheel;
