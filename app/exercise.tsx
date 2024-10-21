import { Text, View, Image } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { Styles } from "@/constants/Styles";
import { Button, Divider, PaperProvider, Paragraph } from "react-native-paper";
import { buttonStyle } from "@/constants/componentsStyles";
import getImageForExercise from "@/components/getImageForExercice";

const Exercise = () => {
    const params = useLocalSearchParams(); // Récupération des paramètres envoyés via la navigation
    const { title, description, primary_muscle, secondary_muscles, reps, completed, success } = params;

    return(
        <PaperProvider>
            <View style={Styles.container}>
                <Text style={Styles.title}>{title}</Text>
                <Text style={Styles.subtitle}>Description : </Text>
                <Paragraph style={Styles.paragraph}>{description}</Paragraph>
                <Divider style={Styles.divider} />
                <Text style={Styles.subtitle}>Muscles travaillé</Text>
                <Text style={Styles.subSubtitle}>Muscle principal : </Text>
                <Paragraph style={Styles.paragraph}>{primary_muscle}</Paragraph>
                <Text style={Styles.subSubtitle}>Muscle secondaire : </Text>
                <Paragraph style={Styles.paragraph}>{secondary_muscles}</Paragraph>
                <Divider style={Styles.divider} />
                <Text style={Styles.subtitle}>Exécution</Text>
                <View style={Styles.imageContainer}>
                    <Image source={getImageForExercise(title.toString())[0]} style={Styles.image} />
                    <Image source={getImageForExercise(title.toString())[1]} style={Styles.image} />
                </View>
                <View style={Styles.exerciseButton}>
                    <Button mode="contained" {...buttonStyle} onPress={() => router.push({ pathname: `/doExercise`, params: { 
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