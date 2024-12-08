import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams, useRouter } from 'expo-router'; // Utilisation d'Expo Router pour la navigation et récupérer les paramètres
import { Button, PaperProvider, Paragraph, TextInput, Card } from "react-native-paper"; // Composants de Material UI pour l'interface
import getImageForExercise from "@/services/getImageForExercice"; // Service pour récupérer les images associées à l'exercice
import { updateExperience } from "@/services/updateExperience"; // Service pour mettre à jour l'expérience du joueur
import { updateGoalExperience } from "@/services/updateGoalExperienceAndLevel"; // Service pour mettre à jour l'expérience de l'objectif
import { useDynamicStyles } from '@/constants/Styles'; // Hook personnalisé pour les styles dynamiques
import { useDynamicStylesComponents } from '@/constants/componentsStyles'; // Hook personnalisé pour les styles des composants spécifiques
import { updateChallengeStatus } from "@/services/updateStatusChallenge"; // Service pour mettre à jour le statut du challenge

const DoChallenge = () => {
    const params = useLocalSearchParams(); // Récupère les paramètres passés à la page depuis la navigation
    const { title, description, reps, time, bonus, malus } = params; // Destructuration des paramètres nécessaires pour l'exercice

    const [userReps, setUserReps] = useState<string>(''); // Gère l'entrée de l'utilisateur pour le nombre de répétitions
    const [completed, setCompleted] = useState<boolean>(false); // Gère l'état de l'exercice (complet ou non)
    const [success, setSuccess] = useState<boolean>(false); // Gère si l'exercice a été effectué avec succès
    const [remainingTime, setRemainingTime] = useState<number>(60); // Temps restant pour accomplir l'exercice (60 secondes par défaut)
    
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents(); // Récupère les styles dynamiques pour les composants
    const styles = useDynamicStyles(); // Styles dynamiques pour le composant
    const router = useRouter(); // Hook pour gérer la navigation

    useEffect(() => {
        // Vérifie et ajuste le temps en fonction du bonus ou malus
        const timeValue = time ? parseInt(time.toString()) : 60; // Si le paramètre time est fourni, il est utilisé, sinon 60 par défaut
        let adjustedTime = timeValue;
    
        // Application du bonus ou malus
        if (bonus == "1") {
            adjustedTime += 10; // Ajoute 10 secondes pour le bonus
        } else if (malus == "1") {
            adjustedTime -= 10; // Retire 10 secondes pour le malus
        }
    
        // Assure que le temps restant est au moins 1 seconde
        if (isNaN(adjustedTime) || adjustedTime <= 0) {
            setRemainingTime(60); // Par défaut, 60 secondes
        } else {
            setRemainingTime(adjustedTime);
        }
    }, [time, bonus, malus]); // Recalcule à chaque fois que le temps, bonus ou malus change

    useEffect(() => {
        if (remainingTime <= 0) {
            return;
        }

        // Décompte du temps restant chaque seconde
        const timer = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer); // Arrête le décompte lorsqu'il atteint 0
                    setCompleted(true); // Marque l'exercice comme complété
                    return 0;
                }
                return prevTime - 1; // Diminue le temps restant de 1 seconde
            });
        }, 1000);

        return () => clearInterval(timer); // Nettoie l'intervalle lors du démontage du composant
    }, [remainingTime]); // Redémarre le timer chaque fois que le temps restant change

    const handleRepsChange = (value: string) => {
        const repsCount = parseInt(value); // Convertit l'entrée en nombre
        const repsAchive = reps ? parseInt(reps.toString()) : 0; // Récupère le nombre de répétitions à accomplir (ou 0 si non défini)
        setUserReps(value); // Mets à jour la valeur de répétitions de l'utilisateur
        if (!isNaN(repsCount)) {
            setCompleted(true); // Marque l'exercice comme complété dès qu'une valeur est entrée
            setSuccess(repsCount >= repsAchive); // Vérifie si l'utilisateur a atteint le nombre requis de répétitions
        }
    };

    const handleSubmit = async () => {
        const statusUpdate = { completed, success }; // Prépare l'objet de mise à jour du statut
        await updateChallengeStatus(title ? title.toString() : '', statusUpdate); // Met à jour le statut du challenge
        await updateExperience(success); // Met à jour l'expérience de l'utilisateur en fonction du succès
        await updateGoalExperience(); // Met à jour l'expérience liée à l'objectif de l'utilisateur

        // Navigue vers la page appropriée selon si l'exercice a été réussi ou non
        if (success === true) {
            router.replace('/wheel'); // Redirige vers la roue si l'exercice est réussi
        } else {
            router.replace('/home'); // Redirige vers l'accueil si l'exercice échoue
        }
    };

    // Formate le temps restant en minutes et secondes
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60); // Convertit les secondes en minutes
        const secs = seconds % 60; // Récupère le reste des secondes
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`; // Formatage du temps pour l'affichage
    };

    return (
        <PaperProvider>
            {/* Utilisation de ScrollView pour permettre à l'utilisateur de faire défiler le contenu si nécessaire */}
            <ScrollView style={[styles.container]}>
                <Text style={styles.title}>{title}</Text> {/* Affiche le titre de l'exercice */}
                <Text style={styles.subtitle}>Tu dois exécuter {reps} répétitions</Text> {/* Affiche le nombre de répétitions à accomplir */}
                
                {/* Affiche le temps restant sous un format minutes:secondes */}
                <Text style={styles.timer}>
                    Temps restant : {formatTime(remainingTime)}
                </Text>
                
                {/* Champ pour entrer le nombre de répétitions réalisées */}
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    keyboardType="numeric"
                    label="Entrez le nombre de répétitions"
                    value={userReps}
                    onChangeText={handleRepsChange}
                    {...textInputStyles} // Applique les styles dynamiques
                />
                
                <Card style={{ margin: 8 }}>
                    <Card.Content>
                        <Paragraph style={styles.paragraph}>
                            {description} {/* Affiche la description de l'exercice */}
                        </Paragraph>
                    </Card.Content>
                
                    {/* Affiche les images associées à l'exercice */}
                    <View style={styles.imageContainer}>
                        <Image source={getImageForExercise(title ? title.toString() : '')[0]} style={styles.image} />
                        <Image source={getImageForExercise(title ? title.toString() : '')[1]} style={styles.image} />
                    </View>
                </Card>
                
                {/* Bouton pour soumettre les résultats */}
                <Button 
                    mode="contained" 
                    onPress={handleSubmit} 
                    {...buttonStyle} // Applique les styles dynamiques
                >
                    Soumettre
                </Button>
            </ScrollView>
        </PaperProvider>
    );
};

export default DoChallenge;
