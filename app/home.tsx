import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { router } from 'expo-router';
import { useEffect, useState } from "react";
import { auth, database } from "@/constants/firebase";
import { onValue, ref } from "firebase/database";
import getDayliExercises from "@/components/getDayliExercises";
import { Styles } from "@/constants/Styles";
import { Button, Card, PaperProvider, Paragraph, Title } from "react-native-paper";
import { buttonStyle } from "@/constants/componentsStyles";

export default function Home() {
  const [userData, setUserData] = useState<{
    pseudo: string | null;
    userId: string | null;
    image: string | null;
    exp: number | null;
    goalExp: number | null;
    niveau: number | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [isListVisible, setIsListVisible] = useState(false);
  const [dailyExercises, setDailyExercises] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // État pour l'erreur

  useEffect(() => {
    const fetchUserData = () => {
      const user = auth.currentUser;
      if (user) {
        setDailyExercises([]); // Vider dailyExercises

        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, async (snapshot) => {
          const data = snapshot.val();
          setUserData({
            pseudo: data?.pseudo || null,
            userId: user.uid,
            image: data?.image || null,
            exp: data?.experience || 0,
            goalExp: data?.goalExp || 100,
            niveau: data?.niveau || 0,
          });
          setLoading(false);

          if (data?.niveau !== undefined) {
            try {
              await getDayliExercises(user.uid, data.niveau);
              const exercisesRef = ref(database, `users/${user.uid}/dailyExercises`);
              onValue(exercisesRef, (exerciseSnapshot) => {
                const exercisesData = exerciseSnapshot.val();
                if (exercisesData && exercisesData.exercises) {
                  setDailyExercises(exercisesData.exercises);
                }
              });
            } catch (error) {
              setError("Erreur lors de la récupération des exercices quotidiens.");
              console.error("Erreur lors de la récupération des exercices quotidiens:", error);
            }
          }
        });
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  if (!userData) {
    return null;
  }

  const Item = ({ title, description, primary_muscle, secondary_muscles, reps, completed, success }: { 
    title: string; 
    description: string; 
    primary_muscle: string; 
    secondary_muscles: string[]; 
    reps: number; 
    completed: boolean;  
    success: boolean;    
  }) => {    
    return (
      <TouchableOpacity 
        onPress={() => router.push({ pathname: `/exercise`, params: { 
          title, 
          description, 
          primary_muscle, 
          secondary_muscles, 
          reps, 
          completed: completed ? 1 : 0, 
          success: success ? 1 : 0 
        } })}
        activeOpacity={0.4}
      >
        <Card style={{ margin: 8 }}>
          <Card.Content>
            <Title>{title}</Title>
            {/* <Paragraph>{description}</Paragraph> */}
            <Paragraph>Muscle principal : {primary_muscle}</Paragraph>
            <Paragraph>Muscles secondaires : {secondary_muscles.join(', ')}</Paragraph>
            <Paragraph>Répétitions : {reps}</Paragraph>
            <Paragraph>Complété : {completed ? 'Oui' : 'Non'}</Paragraph>
            <Paragraph>Succès : {success ? 'Oui' : 'Non'}</Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={Styles.container}>
        <Text style={Styles.title}>Bienvenue, {userData.pseudo}</Text>
        <Button mode="contained" onPress={() => setIsListVisible(!isListVisible)} {...buttonStyle}>
          {isListVisible ? 'Masquer la liste' : 'Afficher les défis quotidiens'}
        </Button>

        {isListVisible && (
          <SafeAreaView>
            <FlatList
              data={dailyExercises}
              renderItem={({ item }) => (
                <Item 
                  title={item.name} 
                  description={item.description} 
                  primary_muscle={item.primary_muscle} 
                  secondary_muscles={item.secondary_muscles} 
                  reps={item.reps} 
                  completed={item.completed} 
                  success={item.success} 
                />
              )}
              keyExtractor={item => item.name}
            />
          </SafeAreaView>
        )}
      </View>
    </PaperProvider>
  );
}
