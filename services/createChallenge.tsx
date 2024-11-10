import { ref, set } from 'firebase/database';
import { database } from '@/constants/firebase';
import exercises from '../assets/data/exercices.json'; // Importer le fichier JSON des exercices
import getNumberOfReps from './calculOfReps';
import getTimeChallenge from './calculOfTimeChallenge';
import { Challenge, CompleteChallenge } from '@/constants/Interfaces';

// Fonction pour créer et sauvegarder un ensemble de challenges pour un utilisateur
export const createChallenge = async (
  userId: string,
  level: number
): Promise<void> => {
  
  const NUMBER_OF_CHALLENGE = 5; // Nombre de challenges à générer
  const reps = getNumberOfReps(level); // Calculer les répétitions en fonction du niveau
  const timeChallenge = getTimeChallenge(level); // Calculer le temps de challenge en fonction du niveau
  const currentDate = new Date().toISOString().split('T')[0];

  // Initialiser une liste vide pour stocker les challenges
  const challengesList: Challenge[] = [];

  // Boucle pour générer des challenges aléatoires
  for (let i = 0; i < NUMBER_OF_CHALLENGE; i++) {
    const randomExercise = exercises.exercises[Math.floor(Math.random() * exercises.exercises.length)];

    // Construire un exercice de type ChallengeExercice
    const challengeExercise: Challenge = {
      name: randomExercise.name,
      description: randomExercise.description,
      primary_muscle: randomExercise.primary_muscle,
      secondary_muscles: randomExercise.secondary_muscles,
      reps: reps,
      completed: false,
      success: false,
      time: timeChallenge,
      bonus: false,
      malus: false,
    };

    // Ajouter le challenge à la liste des challenges
    challengesList.push(challengeExercise);
  }
  // console.log(challengesList)

  // Créer l'objet CompleteChallenge
  const completeChallenge: CompleteChallenge = {
    date: currentDate,
    challenges: challengesList
  };
  // console.log(completeChallenge.challenges);
  // Sauvegarder dans la base de données
  await set(ref(database, `users/${userId}/challenges`), completeChallenge);
};

export default createChallenge;
