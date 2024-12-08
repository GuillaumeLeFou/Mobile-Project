import { Text, View, Image } from "react-native"; 
import { router, useLocalSearchParams } from 'expo-router'; // Utilisation de l'Expo Router pour récupérer les paramètres de la navigation et gérer la navigation
import { useState } from "react"; // Importation de useState pour gérer les états internes
import { Button, PaperProvider, Paragraph, TextInput, Card } from "react-native-paper"; // Composants de Paper pour l'UI
import getImageForExercise from "@/services/getImageForExercice"; // Service pour obtenir les images associées à l'exercice
import { updateExerciseStatus } from "@/services/updateStatusExercise"; // Service pour mettre à jour le statut de l'exercice
import { updateExperience } from "@/services/updateExperience"; // Service pour mettre à jour l'expérience de l'utilisateur
import { updateGoalExperience } from "@/services/updateGoalExperienceAndLevel"; // Service pour mettre à jour l'expérience liée à l'objectif
import { useDynamicStyles } from '@/constants/Styles'; // Hook personnalisé pour récupérer des styles dynamiques
import { useDynamicStylesComponents } from '@/constants/componentsStyles'; // Hook pour récupérer les styles des composants spécifiques

const DoExercise = () => {
    // Récupère les paramètres de la navigation
    const params = useLocalSearchParams(); 
    const { title, description, reps } = params; // Destructuration des paramètres (titre, description, et répétitions de l'exercice)

    // Déclaration des états locaux
    const [userReps, setUserReps] = useState<string>(''); // Gère le nombre de répétitions entrées par l'utilisateur
    const [completed, setCompleted] = useState<boolean>(false); // Gère si l'exercice est complété ou non
    const [success, setSuccess] = useState<boolean>(false); // Gère si l'exercice est réussi ou non

    const { textInputStyles, buttonStyle } = useDynamicStylesComponents(); // Récupère les styles dynamiques pour les composants
    const styles = useDynamicStyles(); // Récupère les styles globaux du composant

    // Fonction pour gérer les changements dans l'entrée des répétitions de l'utilisateur
    const handleRepsChange = (value: string) => {
        const repsCount = parseInt(value); // Convertit la valeur en nombre
        const repsAchive = parseInt(reps.toString()); // Récupère le nombre de répétitions à atteindre
        setUserReps(value); // Mets à jour l'état avec la nouvelle valeur entrée par l'utilisateur
        if (!isNaN(repsCount)) {
            setCompleted(true); // Dès qu'une valeur est entrée, l'exercice est marqué comme complété
            setSuccess(repsCount >= repsAchive); // Si le nombre de répétitions est suffisant, l'exercice est marqué comme réussi
        }
    };

    // Fonction qui est appelée lors de la soumission des résultats
    const handleSubmit = async () => {
        const statusUpdate = { completed, success }; // Crée un objet avec les informations de statut de l'exercice
        // Mise à jour des statuts de l'exercice et de l'expérience
        await updateExerciseStatus(title.toString(), statusUpdate);
        await updateExperience(success); // Met à jour l'expérience en fonction du succès
        await updateGoalExperience(); // Met à jour l'expérience en fonction de l'objectif
        router.dismissAll(); // Ferme toutes les pages ouvertes
        router.replace('/home'); // Redirige vers la page d'accueil après la soumission
    };

    return (
        <PaperProvider>
            <View style={[styles.container]}>
                {/* Affichage du titre de l'exercice */}
                <Text style={styles.title}>{title}</Text>
                {/* Affichage du nombre de répétitions à réaliser */}
                <Text style={styles.subtitle}>Tu dois exécuter {reps} répétitions</Text>
                
                {/* Champ de saisie pour le nombre de répétitions de l'utilisateur */}
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    keyboardType="numeric" // Définit le clavier numérique pour les entrées
                    label="Entrez le nombre de répétitions"
                    value={userReps} // La valeur est liée à l'état `userReps`
                    onChangeText={handleRepsChange} // Appelle la fonction pour gérer les changements
                    {...textInputStyles} // Applique les styles dynamiques
                />
                
                {/* Carte contenant la description de l'exercice */}
                <Card style={{ margin: 8 }}>
                    <Card.Content>
                        <Paragraph style={styles.paragraph}>
                            {description} {/* Affiche la description de l'exercice */}
                        </Paragraph>
                    </Card.Content>
                
                    {/* Affichage des images associées à l'exercice */}
                    <View style={styles.imageContainer}>
                        <Image source={getImageForExercise(title.toString())[0]} style={styles.image} />
                        <Image source={getImageForExercise(title.toString())[1]} style={styles.image} />
                    </View>
                </Card>
                
                {/* Bouton pour soumettre les résultats */}
                <Button mode="contained" onPress={handleSubmit} {...buttonStyle}>
                    Soumettre
                </Button>
                
                {/* Affichage du résultat après soumission, si l'exercice est complété */}
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
