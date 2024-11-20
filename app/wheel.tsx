import { Text, View, Image, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { PaperProvider } from "react-native-paper";
import { useDynamicStyles } from '@/constants/Styles';
import { useState, useEffect } from "react";
import { getPlayers } from "@/services/getPlayers";
import { getChallenge } from "@/services/getChallenges";
import { Challenge } from "@/constants/Interfaces"; // Assurez-vous que l'interface Challenge est bien importée
import { updateBonusMalusChallenge } from "@/services/updateBonusMalusChallenge";

const Wheel = () => {
    const styles = useDynamicStyles();
    const router = useRouter();
    const randomBonusMalus = Math.random() < 0.5 ? -10 : 10;
    const [textBonusMalus, setTextBonusMalus] = useState<string>('');
    const [showImage, setShowImage] = useState<boolean>(false); 
    const [players, setPlayers] = useState<any[]>([]);
    const [bonus, setBonus] = useState<boolean>(false);
    const [malus, setMalus] = useState<boolean>(false);
    const [playerChallenges, setPlayerChallenges] = useState<Challenge[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

    useEffect(() => {
        if (randomBonusMalus === 10) {
            setTextBonusMalus("Bravo ! Tu peux donner un bonus à quelqu'un");
            setBonus(true);
        } else {
            setTextBonusMalus("Aïe ! Tu dois donner un malus à quelqu'un");
            setMalus(true);
        }

        setShowImage(true);
        const timer = setTimeout(() => {
            setShowImage(false);
        }, 3000);

        getPlayers((sortedPlayers) => {
            setPlayers(sortedPlayers);
        });

        return () => clearTimeout(timer);
    }, []);

    const handlePlayerClick = async (pseudo: string) => {
        const challenges = await getChallenge(pseudo);  // Cette fonction doit inclure le pseudo du joueur
        setPlayerChallenges(challenges);
        setSelectedPlayer(pseudo); // Enregistrer le pseudo du joueur sélectionné
    };

    // Fonction pour gérer le clic sur un challenge
    const handleChallengeClick = (challenge: Challenge) => {
        const statusBonusMalus = { bonus, malus };
        updateBonusMalusChallenge(selectedPlayer!, challenge.name, statusBonusMalus);
        Alert.alert(
            "Détails du Challenge",
            `Nom: ${challenge.name}\nDescription: ${challenge.description}\nReps: ${challenge.reps}`,
            [{ text: "OK" }]
        );
    };

    // Rendu de chaque défi cliquable dans la liste
    const renderChallenge = ({ item, index }: { item: Challenge; index: number }) => (
        <TouchableOpacity onPress={() => handleChallengeClick(item)}>
            <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text>{item.description}</Text>
                <Text>Reps: {item.reps}</Text>
                <Text>Muscle principal: {item.primary_muscle}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <PaperProvider>
            <View style={[styles.container, { alignItems: 'center' }]}>
                <Text style={styles.title}>Bonus ou Malus !</Text>

                {showImage && (
                    <Image 
                        source={require('@/assets/images/wheel/wheel.gif')} 
                        style={{ width: 150, height: 150 }} 
                    />
                )}

                {!showImage && (
                    <Text style={styles.subSubtitle}>{textBonusMalus}</Text>
                )}

                <FlatList
                    data={players}
                    keyExtractor={(item, index) => `${item.pseudo}_${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handlePlayerClick(item.pseudo)}>
                            <View style={{ padding: 10 }}>
                                <Text>{item.pseudo}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                {playerChallenges.length > 0 && (
                    <>
                        <Text style={styles.subSubtitle}>Défis pour le joueur sélectionné :</Text>
                        <FlatList
                            data={playerChallenges}
                            keyExtractor={(item, index) => `${item.name}_${index}`}
                            renderItem={renderChallenge}
                        />
                    </>
                )}
            </View>
        </PaperProvider>
    );
}

export default Wheel;
