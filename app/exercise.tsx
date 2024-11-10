import { Text, View, Image } from "react-native";
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Button, Divider, PaperProvider, Paragraph } from "react-native-paper";
import getImageForExercise from "@/services/getImageForExercice";
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';

const Exercise = () => {
    const params = useLocalSearchParams(); // Récupération des paramètres envoyés via la navigation
    const { title, description, primary_muscle, secondary_muscles, reps, completed, success } = params;
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();
    const router = useRouter();

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
                <Text style={styles.subtitle}>Exécution</Text>
                <View style={styles.imageContainer}>
                    <Image source={getImageForExercise(title.toString())[0]} style={styles.image} />
                    <Image source={getImageForExercise(title.toString())[1]} style={styles.image} />
                </View>
                <View style={styles.exerciseButton}>
                    <Button mode="contained" {...buttonStyle} onPress={() =>router.replace({ pathname: `/doExercise`, params: { 
                            title, 
                            description, 
                            reps,
                            } })}>
                        Commencer l'exercice
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
}

export default Exercise;