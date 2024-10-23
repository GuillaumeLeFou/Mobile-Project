import { Text, View, Image } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from "react";
import { Button, PaperProvider, Paragraph, TextInput, Divider, Card, Title } from "react-native-paper";
import getImageForExercise from "@/components/getImageForExercice";
import { updateExerciseStatus } from "@/services/exerciseService"; // Exemple de service pour mettre à jour les données
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';

const DoExercise = () => {
    const params = useLocalSearchParams(); // Récupération des paramètres envoyés via la navigation
    const { title, description, reps } = params;

    const [userReps, setUserReps] = useState(''); // État pour le nombre de répétitions entrées par l'utilisateur
    const [completed, setCompleted] = useState(false); // État pour savoir si l'exercice est complété
    const [success, setSuccess] = useState(false); // État pour le succès
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();

    const handleRepsChange = (value: string) => {
        const repsCount = parseInt(value);
        const repsAchive = parseInt(reps.toString());
        setUserReps(value);
        if (!isNaN(repsCount)) {
            setCompleted(true); // Mettre completed à true dès qu'une valeur est entrée
            setSuccess(repsCount >= repsAchive); // Vérifie si le nombre de répétitions est suffisant
        }
    };

    const handleSubmit = () => {
        // Si vous avez besoin de mettre à jour la base de données
        const statusUpdate = { completed, success };
        updateExerciseStatus(title.toString(), statusUpdate); // Fonction fictive pour mettre à jour le statut de l'exercice
        // router.back(); // Retour à la page précédente après la soumission (facultatif)
    };

    return (
        <PaperProvider>
            <View style={[styles.container]}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Tu dois exécuter {reps} répétitions</Text>
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
                        <Image source={getImageForExercise(title.toString())[0]} style={styles.image} />
                        <Image source={getImageForExercise(title.toString())[1]} style={styles.image} />
                    </View>
                </Card>
                <Button mode="contained" onPress={handleSubmit} {...buttonStyle}>
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

export default DoExercise;
