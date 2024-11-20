import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
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
    const { title, description, reps, time, bonus, malus } = params;

    const [userReps, setUserReps] = useState<string>(''); // État pour le nombre de répétitions entrées par l'utilisateur
    const [completed, setCompleted] = useState<boolean>(false); // État pour savoir si l'exercice est complété
    const [success, setSuccess] = useState<boolean>(false); // État pour le succès
    const [remainingTime, setRemainingTime] = useState<number>(60); // Temps restant en secondes (valeur par défaut)
    
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();

    useEffect(() => {
        // Vérification de la validité de params.time avant de le convertir
        const timeValue = time ? parseInt(time.toString()) : 60;
        let adjustedTime = timeValue;
    
        // Appliquer le bonus ou le malus si applicable
        if (bonus == "1") {
            adjustedTime += 10; // Ajouter 10 secondes pour le bonus
        } else if (malus == "1") {
            adjustedTime -= 10; // Retirer 10 secondes pour le malus
        }
    
        // Assurer que le temps restant est au moins 1 seconde
        if (isNaN(adjustedTime) || adjustedTime <= 0) {
            setRemainingTime(60); // Valeur par défaut de 60 secondes
        } else {
            setRemainingTime(adjustedTime);
        }
    }, [time, bonus, malus]);

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
        if(success === true){
            router.replace('/wheel');
        } else {
            router.replace('/home');
        }
    };

    // Formater le temps restant en minutes et secondes
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <PaperProvider>
            <ScrollView style={[styles.container]}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Tu dois exécuter {reps} répétitions</Text>
                
                <Text style={styles.timer}>
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
            </ScrollView>
        </PaperProvider>
    );
};

export default DoChallenge;