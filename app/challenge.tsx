import { Text, View, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importation des hooks pour accéder aux paramètres et à la navigation
import { Button, Divider, PaperProvider, Paragraph } from "react-native-paper"; // Importation des composants UI
import getImageForExercise from "@/services/getImageForExercice"; // Service pour récupérer les images de l'exercice
import { useDynamicStyles } from '@/constants/Styles'; // Hook personnalisé pour appliquer des styles dynamiques
import { useDynamicStylesComponents } from '@/constants/componentsStyles'; // Hook personnalisé pour les styles de composants spécifiques

const Exercise = () => {
    // Récupération des paramètres passés à la page
    const params = useLocalSearchParams();
    const { title, description, primary_muscle, secondary_muscles, reps, completed, success, bonus, malus, time } = params;

    // Initialisation des hooks pour les styles et la navigation 
    const { buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();
    const router = useRouter();
    
    // Variables pour gérer les bonus/malus et le texte associé
    let newBonus = "false";
    let newMalus = "false";
    let detailExercise = "Tu n'as pas de bonus ni de malus pour ce challenge";

    // Définition des bonus et malus si présents dans les paramètres
    if (bonus === "1"){
        newBonus = "true";
        detailExercise = "Tu as un bonus pour ce challenge de 10 secondes";
    }
    if (malus === "1"){
        newMalus = "true";
        detailExercise = "Tu as un malus pour ce challenge de 10 secondes";
    }

    return (
        <PaperProvider>
            {/* Utilisation de ScrollView pour permettre le défilement de contenu */}
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{title}</Text> {/* Affichage du titre de l'exercice */}
                
                <Text style={styles.subtitle}>Description : </Text>
                <Paragraph style={styles.paragraph}>{description}</Paragraph> {/* Affichage de la description de l'exercice */}
                
                <Divider style={styles.divider} /> {/* Séparateur visuel */}

                <Text style={styles.subtitle}>Muscles travaillé</Text>
                <Text style={styles.subSubtitle}>Muscle principal : </Text>
                <Paragraph style={styles.paragraph}>{primary_muscle}</Paragraph> {/* Affichage du muscle principal travaillé */}
                <Text style={styles.subSubtitle}>Muscle secondaire : </Text>
                <Paragraph style={styles.paragraph}>{secondary_muscles}</Paragraph> {/* Affichage des muscles secondaires travaillés */}

                <Divider style={styles.divider} /> {/* Séparateur visuel */}

                <Text style={styles.subtitle}>Détail</Text>
                <Paragraph style={styles.paragraph}>{detailExercise}</Paragraph> {/* Affichage du détail du bonus/malus */}

                <Divider style={styles.divider} /> {/* Séparateur visuel */}

                <Text style={styles.subtitle}>Temps</Text>
                <Paragraph style={styles.paragraph}>Tu as {time} secondes pour faire le challenge</Paragraph> {/* Affichage du temps imparti pour l'exercice */}

                <Divider style={styles.divider} /> {/* Séparateur visuel */}

                <Text style={styles.subtitle}>Exécution</Text>
                <View style={styles.imageContainer}>
                    {/* Affichage des images associées à l'exercice (avec un tableau d'images) */}
                    <Image source={getImageForExercise(title.toString())[0]} style={styles.image} />
                    <Image source={getImageForExercise(title.toString())[1]} style={styles.image} />
                </View>

                {/* Bouton pour démarrer l'exercice */}
                <View style={styles.exerciseButton}>
                    <Button mode="contained" {...buttonStyle} onPress={() => 
                        router.replace({ pathname: `/doChallenge`, params: { 
                            title, 
                            description, 
                            reps,
                            time,
                            bonus,
                            malus,
                        } })
                    }>
                        Commencer l'exercice
                    </Button>
                </View>
            </ScrollView>
        </PaperProvider>
    );
}

export default Exercise;
