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
  const [isListDailyExercisesVisible, setIsListDailyExercisesVisible] = useState(false); // Contrôle de l'affichage des exercices quotidiens
  const [isListChallengesVisible, setIsListChallengesVisible] = useState(false); // Contrôle de l'affichage des challenges
  const isRankedVisible = isListDailyExercisesVisible || isListChallengesVisible; // Détermine si le classement des joueurs doit être affiché
  const [dailyExercises, setDailyExercises] = useState<any[]>([]); // Liste des exercices quotidiens
  const [challengeExercises, setChallengeExercises] = useState<any[]>([]); // Liste des challenges
  const [error, setError] = useState<string | null>(null); // Gère les erreurs d'affichage
  const { buttonStyle } = useDynamicStylesComponents(); // Récupère le style pour les boutons
  const [players, setPlayers] = useState<Player[]>([]); // Liste des joueurs pour le classement
  const styles = useDynamicStyles(); // Récupère les styles dynamiques

  const { userData, loading } = fetchUserData(); // Récupère les données de l'utilisateur, y compris son niveau et ses exercices

  useEffect(() => {
    if (!userData) {
      setError('Données utilisateur manquantes');
      return;
    }

    // Lors du chargement des données utilisateur, mise à jour des exercices et challenges
    const currentDate = new Date().toISOString().split('T')[0]; // Récupère la date actuelle sous forme de chaîne
    if (userData && userData.dailyExercises) {
      const exercisesList = userData.dailyExercises.exercises || [];
      if (exercisesList.length === 0 && userData.userId && userData.niveau) {
        createDailyExercises(userData.userId, userData.niveau); // Si aucun exercice n'existe, on les crée
      } else {
        setDailyExercises(exercisesList); // Sinon, on met à jour la liste d'exercices
      }
    }

    if (userData && userData.challenges) {
      const challengeList = userData.challenges.challenges || [];
      if (challengeList.length === 0 && userData.userId && userData.niveau) {
        createChallenge(userData.userId, userData.niveau); // Si aucun challenge n'existe, on les crée
      } else {
        setChallengeExercises(challengeList); // Sinon, on met à jour la liste des challenges
      }
    }

    getPlayers((sortedPlayers) => { // Récupère et trie les joueurs pour le classement
      setPlayers(sortedPlayers);
    });
  }, [userData]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Affiche un indicateur de chargement pendant que les données sont récupérées
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>; // Affiche un message d'erreur s'il y en a
  }

  if (!userData) {
    return null; // Si l'utilisateur n'est pas connecté, on ne rend rien
  }

  // Composant pour afficher un exercice quotidien
  const ItemDailyExercises = ({ title = "", description = "", primary_muscle = "", secondary_muscles = [], reps = 0, completed = false, success = false }: { 
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
        disabled={completed} // Désactive le bouton si l'exercice est déjà complété
      >
        <Card style={[{ margin: 8 }, completed && success ? styles.cardSuccess : completed && !success ? styles.cardFailure : null]}>
          <Card.Content>
            <Title>{title}</Title>
            <Paragraph>Effectuer {reps} répétitions</Paragraph>
          </Card.Content>
          <Card.Cover source={require('../assets/images/musclesWorked/pompes.png')} style={styles.cardCover} /> {/* Affiche une image par défaut */}
        </Card>
      </TouchableOpacity>
    );
  };

  // Composant pour afficher un challenge
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
        disabled={completed} // Désactive le bouton si le challenge est déjà complété
      >
        <Card style={[{ margin: 8 }, completed && success ? styles.cardSuccess : completed && !success ? styles.cardFailure : null]}>
          <Card.Content>
            <Title>{title}</Title>
            <Paragraph>Effectuer {reps} répétitions</Paragraph>
          </Card.Content>
          <Card.Cover source={require('../assets/images/musclesWorked/pompes.png')} style={styles.cardCover} /> {/* Affiche une image par défaut */}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue, {userData.pseudo}</Text>
        {/* Boutons pour afficher/masquer les listes */}
        <Button mode="contained" onPress={() => setIsListDailyExercisesVisible(!isListDailyExercisesVisible)} {...buttonStyle}>
          {isListDailyExercisesVisible ? 'Masquer la liste des défis' : 'Afficher les défis quotidiens'}
        </Button>
        <Button style={{ marginTop: 10 }} mode="contained" onPress={() => setIsListChallengesVisible(!isListChallengesVisible)} {...buttonStyle}>
          {isListChallengesVisible ? 'Masquer les challenges' : 'Afficher les challenges'}
        </Button>

        {/* Liste des exercices quotidiens */}
        {isListDailyExercisesVisible && !isListChallengesVisible && dailyExercises.length > 0 && (
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

        {/* Liste des challenges */}
        {isListChallengesVisible && !isListDailyExercisesVisible && challengeExercises.length > 0 && (
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

        {/* Affichage du classement des joueurs */}
        {!isRankedVisible && players.length > 0 && (
          <>
            <Text style={styles.title}>Ranked</Text>
            {players.map((player, index) => (
              <Card key={player.pseudo} style={styles.rankStyleHeader}>
                <Card.Content>
                  <Title>
                    {index + 1}. {player.pseudo}
                  </Title>
                  <Paragraph><Text>Niveau : {player.niveau}</Text></Paragraph>
                  <Paragraph><Text>Expérience : {player.exp}</Text></Paragraph>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </View>
    </PaperProvider>
  );
}
