import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { router } from 'expo-router';
import { useEffect, useState } from "react";
import { auth, database } from "@/constants/firebase";
import { onValue, ref } from "firebase/database";
import { Button, Card, PaperProvider, Paragraph, Title } from "react-native-paper";
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';
import { updateGoalExperience } from '@/services/updateGoalExperienceAndLevel';
import { getPlayers } from "@/services/getPlayers";
import { fetchUserData } from "@/services/fetchUserData";
import { createChallenge } from "@/services/createChallenge";
import { createDailyExercises } from "@/services/createDailyExercises";

interface Player {
  pseudo: string;
  niveau: number;
  exp: number;
}


export default function Home() {
  // const [loading, setLoading] = useState(true);
  const [isListDailyExercisesVisible, setIsListDailyExercisesVisible] = useState(false);
  const [isListChallengesVisible, setIsListChallengesVisible] = useState(false);
  const isRankedVisible = isListDailyExercisesVisible || isListChallengesVisible;
  const [dailyExercises, setDailyExercises] = useState<any[]>([]);
  const [challengeExercises, setChallengeExercises] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { buttonStyle } = useDynamicStylesComponents();
  const [players, setPlayers] = useState<Player[]>([]);
  const styles = useDynamicStyles();

  const { userData, loading } = fetchUserData();

  useEffect(() => {
    // updateGoalExperience();
    const currentDate = new Date().toISOString().split('T')[0];
    if (userData && userData.dailyExercises) {
      const exercisesList = userData.dailyExercises.exercises || [];
      if(exercisesList.length === 0 && userData.userId && userData.niveau){
        createDailyExercises(userData.userId, userData.niveau);
      } else {
        setDailyExercises(exercisesList);
      }
    } 
    if (userData && userData.challenges){
      const challengeList = userData.challenges.challenges || [];
      if(challengeList.length === 0 && userData.userId && userData.niveau){
        createChallenge(userData.userId, userData.niveau);
      } else {
        setChallengeExercises(challengeList);
      }
    }


  }, [userData]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  if (!userData) {
    return null;
  }

  const ItemDailyExercises = ({ title, description, primary_muscle, secondary_muscles, reps, completed, success }: { 
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
        disabled={completed}
      >
        <Card style={[{ margin: 8 }, completed && success ? styles.cardSuccess : completed && !success ? styles.cardFailure : null]}>
          <Card.Content>
            <Title>{title}</Title>
            <Paragraph>Effectuer {reps} répétitions</Paragraph>
          </Card.Content>
          <Card.Cover source={require('../assets/images/musclesWorked/pompes.png')} style={styles.cardCover} />
        </Card>
      </TouchableOpacity>
    );
  };

  const ItemChallenge = ({ title, description, primary_muscle, secondary_muscles, reps, completed, success, bonus, malus }: { 
    title: string; 
    description: string; 
    primary_muscle: string; 
    secondary_muscles: string[]; 
    reps: number; 
    completed: boolean;  
    success: boolean;
    bonus: boolean;
    malus: boolean;
  }) => {    
    return (
      <TouchableOpacity 
        onPress={() => router.push({ pathname: `/challenge`, params: { 
          title, 
          description, 
          primary_muscle, 
          secondary_muscles, 
          reps, 
          completed: completed ? 1 : 0, 
          success: success ? 1 : 0,
          bonus: bonus ? 1 : 0,
          malus: malus ? 1 : 0,
        } })} 
        activeOpacity={0.4} 
        disabled={completed}
      >
        <Card style={[{ margin: 8 }, completed && success ? styles.cardSuccess : completed && !success ? styles.cardFailure : null]}>
          <Card.Content>
            <Title>{title}</Title>
            <Paragraph>Effectuer {reps} répétitions</Paragraph>
          </Card.Content>
          <Card.Cover source={require('../assets/images/musclesWorked/pompes.png')} style={styles.cardCover} />
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue, {userData.pseudo}</Text>
        <Button mode="contained" onPress={() => setIsListDailyExercisesVisible(!isListDailyExercisesVisible)} {...buttonStyle}>
          {isListDailyExercisesVisible ? 'Masquer la liste des défis' : 'Afficher les défis quotidiens'}
        </Button>
        <Button style={{ marginTop: 10 }} mode="contained" onPress={() => setIsListChallengesVisible(!isListChallengesVisible)} {...buttonStyle}>
          {isListChallengesVisible ? 'Masquer les challenges' : 'Afficher les challenges'}
        </Button>

        {isListDailyExercisesVisible && !isListChallengesVisible && (
          <FlatList
            data={dailyExercises}
            renderItem={({ item }) => (
              <ItemDailyExercises 
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
        )}

        {isListChallengesVisible && !isListDailyExercisesVisible && (
          <FlatList
            data={challengeExercises}
            renderItem={({ item, index }) => (
              <ItemChallenge 
                title={item.name}
                description={item.description}
                primary_muscle={item.primary_muscle}
                secondary_muscles={item.secondary_muscles}
                reps={item.reps}
                completed={item.completed}
                success={item.success}
                bonus={item.bonus}
                malus={item.malus} />
            )}
            keyExtractor={(item, index) => `${item.name}-${index}`}
          />
        )}

        {!isRankedVisible && (
        <>
          <Text style={styles.title}>Ranked</Text>
          {players.map((player, index) => (
            <Card key={player.pseudo} style={styles.rankStyleHeader}>
              <Card.Content>
                <Title>
                  {index + 1}. {player.pseudo}
                </Title>
                <Paragraph>Niveau : {player.niveau}</Paragraph>
                <Paragraph>Expérience : {player.exp}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </>
        )}
      </View>
    </PaperProvider>
  );
}
