import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { Button, PaperProvider, Paragraph, TextInput, Card } from "react-native-paper";
import getImageForExercise from "@/services/getImageForExercice";
import { updateExperience } from "@/services/updateExperience";
import { updateGoalExperience } from "@/services/updateGoalExperienceAndLevel";
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';
import { updateChallengeStatus } from "@/services/updateStatusChallenge";

const DoChallenge = () => {
    const params = useLocalSearchParams(); // Récupération des paramètres envoyés via la navigation
    const { title, description, reps, time } = params;

    const [userReps, setUserReps] = useState<string>(''); // État pour le nombre de répétitions entrées par l'utilisateur
    const [completed, setCompleted] = useState<boolean>(false); // État pour savoir si l'exercice est complété
    const [success, setSuccess] = useState<boolean>(false); // État pour le succès
    const [remainingTime, setRemainingTime] = useState<number>(60); // Temps restant en secondes (valeur par défaut)
    
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();

    useEffect(() => {
        // Vérification de la validité de params.time avant de le convertir
        const timeValue = time ? parseInt(time.toString()) : 60;
        if (isNaN(timeValue) || timeValue <= 0) {
            setRemainingTime(60); // Valeur par défaut de 60 secondes
        } else {
            setRemainingTime(timeValue);
        }
    }, [time]);

    useEffect(() => {
        if (remainingTime <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setCompleted(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Nettoyage de l'intervalle lors du démontage
    }, [remainingTime]);

    const handleRepsChange = (value: string) => {
        const repsCount = parseInt(value);
        const repsAchive = reps ? parseInt(reps.toString()) : 0; // Assurer que reps est valide
        setUserReps(value);
        if (!isNaN(repsCount)) {
            setCompleted(true); // Mettre completed à true dès qu'une valeur est entrée
            setSuccess(repsCount >= repsAchive); // Vérifie si le nombre de répétitions est suffisant
        }
    };

    const handleSubmit = async () => {
        const statusUpdate = { completed, success };
        await updateChallengeStatus(title ? title.toString() : '', statusUpdate);
        await updateExperience(success);
        await updateGoalExperience();
        router.dismissAll();
        router.replace('/home');
    };

    // Formater le temps restant en minutes et secondes
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <PaperProvider>
            <View style={[styles.container]}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Tu dois exécuter {reps} répétitions</Text>
                
                {/* Affichage du minuteur */}
                <Text style={stylesLocal.timer}>
                    Temps restant : {formatTime(remainingTime)}
                </Text>
                
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    keyboardType="numeric"
                    label="Entrez le nombre de répétitions"
                    value={userReps}
                    onChangeText={handleRepsChange}
                    {...textInputStyles}
                />
                <Card style={{ margin: 8 }}>
                    <Card.Content>
                        <Paragraph style={styles.paragraph}>
                            {description}
                        </Paragraph>
                    </Card.Content>
                
                    <View style={styles.imageContainer}>
                        <Image source={getImageForExercise(title ? title.toString() : '')[0]} style={styles.image} />
                        <Image source={getImageForExercise(title ? title.toString() : '')[1]} style={styles.image} />
                    </View>
                </Card>
                <Button 
                    mode="contained" 
                    onPress={handleSubmit} 
                    {...buttonStyle}
                >
                    Soumettre
                </Button>
                {completed && (
                    <Text style={styles.result}>
                        {success ? 'Exercice réussi !' : 'Essayez à nouveau.'}
                    </Text>
                )}
            </View>
        </PaperProvider>
    );
};

const stylesLocal = StyleSheet.create({
    timer: {
        fontSize: 20,
        marginVertical: 10,
        fontWeight: 'bold',
        color: '#FF4500',
    },
    // Autres styles peuvent être ajoutés ici si nécessaire
});

export default DoChallenge;
