import { Text, View, Image } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Divider, PaperProvider, Paragraph } from "react-native-paper";
import getImageForExercise from "@/services/getImageForExercice";
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';
// import Wheel from "@/components/wheel";

const Exercise = () => {
    const params = useLocalSearchParams(); // Récupération des paramètres envoyés via la navigation
    const { title, description, primary_muscle, secondary_muscles, reps, completed, success, bonus, malus, time } = params;
    const { buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();
    const router = useRouter();
    let newBonus = "false";
    let newMalus = "false";
    let detailExercise = "Tu n'as pas de bonus nis de malus pour ce challenge";


    if (bonus === "1"){
        newBonus = "true";
        detailExercise = "Tu as un bonus pour ce challenge";
    }
    if (malus === "1"){
        newMalus = "true";
        detailExercise = "Tu as un malus pour ce challenge";
    }
    return(
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Description : </Text>
                <Paragraph style={styles.paragraph}>{description}</Paragraph>
                <Divider style={styles.divider} />
                <Text style={styles.subtitle}>Muscles travaillé</Text>
                <Text style={styles.subSubtitle}>Muscle principal : </Text>
                <Paragraph style={styles.paragraph}>{primary_muscle}</Paragraph>
                <Text style={styles.subSubtitle}>Muscle secondaire : </Text>
                <Paragraph style={styles.paragraph}>{secondary_muscles}</Paragraph>
                <Divider style={styles.divider} />
                <Text style={styles.subtitle}>Détail</Text>
                <Paragraph style={styles.paragraph}>{detailExercise}</Paragraph>
                <Divider style={styles.divider} />
                <Text style={styles.subtitle}>Temps</Text>
                <Paragraph style={styles.paragraph}>Tu as {time} secondes pour faire le challenge</Paragraph>
                <Divider style={styles.divider} />
                <Text style={styles.subtitle}>Exécution</Text>
                <View style={styles.imageContainer}>
                    <Image source={getImageForExercise(title.toString())[0]} style={styles.image} />
                    <Image source={getImageForExercise(title.toString())[1]} style={styles.image} />
                </View>
                <View style={styles.exerciseButton}>
                    <Button mode="contained" {...buttonStyle} onPress={() =>router.replace({ pathname: `/doChallenge`, params: { 
                            title, 
                            description, 
                            reps,
                            time,
                            } })}>
                        Commencer l'exercice
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
}

export default Exercise;