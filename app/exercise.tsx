import { Text, View, Image } from "react-native"; // Importation des composants de base de React Native pour l'UI
import { router, useLocalSearchParams, useRouter } from 'expo-router'; // Utilisation du router d'Expo pour la navigation et récupérer les paramètres
import { useEffect, useState } from "react"; // Importation des hooks useState et useEffect
import { Button, Divider, PaperProvider, Paragraph } from "react-native-paper"; // Composants supplémentaires de react-native-paper pour l'UI
import getImageForExercise from "@/services/getImageForExercice"; // Service pour obtenir les images associées à l'exercice
import { useDynamicStyles } from '@/constants/Styles'; // Hook pour récupérer les styles dynamiques de l'application
import { useDynamicStylesComponents } from '@/constants/componentsStyles'; // Hook pour récupérer les styles dynamiques des composants

const Exercise = () => {
    // Récupère les paramètres passés par la navigation
    const params = useLocalSearchParams(); 
    const { title, description, primary_muscle, secondary_muscles, reps, completed, success } = params; 

    // Déclare les styles dynamiques pour l'UI
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents(); 
    const styles = useDynamicStyles(); 

    // Initialise le router pour la navigation
    const router = useRouter();

    return (
        <PaperProvider> 
            {/* Wrapper principal qui contient tout le contenu à afficher */}
            <View style={styles.container}> 
                {/* Affichage du titre de l'exercice */}
                <Text style={styles.title}>{title}</Text>

                {/* Affichage de la description de l'exercice */}
                <Text style={styles.subtitle}>Description : </Text>
                <Paragraph style={styles.paragraph}>{description}</Paragraph>

                {/* Ligne de séparation */}
                <Divider style={styles.divider} />

                {/* Affichage des muscles travaillés */}
                <Text style={styles.subtitle}>Muscles travaillé</Text>
                <Text style={styles.subSubtitle}>Muscle principal : </Text>
                <Paragraph style={styles.paragraph}>{primary_muscle}</Paragraph>
                <Text style={styles.subSubtitle}>Muscle secondaire : </Text>
                <Paragraph style={styles.paragraph}>{secondary_muscles}</Paragraph>

                {/* Ligne de séparation */}
                <Divider style={styles.divider} />

                {/* Section pour afficher les images de l'exercice */}
                <Text style={styles.subtitle}>Exécution</Text>
                <View style={styles.imageContainer}>
                    {/* Affichage des images associées à l'exercice */}
                    <Image source={getImageForExercise(title.toString())[0]} style={styles.image} />
                    <Image source={getImageForExercise(title.toString())[1]} style={styles.image} />
                </View>

                {/* Bouton pour démarrer l'exercice */}
                <View style={styles.exerciseButton}>
                    <Button 
                        mode="contained" 
                        {...buttonStyle} 
                        // Lorsqu'on appuie sur le bouton, la navigation se fait vers la page pour réaliser l'exercice
                        onPress={() => router.replace({ 
                            pathname: `/doExercise`, 
                            params: { 
                                title, 
                                description, 
                                reps, 
                            } 
                        })}>
                        Commencer l'exercice
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
}

export default Exercise;
