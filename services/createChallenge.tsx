import { ref, set } from 'firebase/database';  // Import des méthodes pour interagir avec Firebase Realtime Database
import { database } from '@/constants/firebase'; // Import de la configuration Firebase
import exercises from '../assets/data/exercices.json'; // Importation des exercices depuis un fichier JSON
import getNumberOfReps from './calculOfReps';  // Fonction pour calculer le nombre de répétitions en fonction du niveau
import getTimeChallenge from './calculOfTimeChallenge'; // Fonction pour calculer le temps du challenge en fonction du niveau
import { Challenge, CompleteChallenge } from '@/constants/Interfaces'; // Import des types Challenge et CompleteChallenge

// Fonction principale pour créer et sauvegarder un ensemble de challenges pour un utilisateur
export const createChallenge = async (
  userId: string,  // ID de l'utilisateur pour lequel les challenges sont créés
  level: number    // Niveau de l'utilisateur pour déterminer la difficulté
): Promise<void> => {
  
  const NUMBER_OF_CHALLENGE = 5; // Nombre de challenges à générer
  const reps = getNumberOfReps(level); // Calcul des répétitions en fonction du niveau
  const timeChallenge = getTimeChallenge(level); // Calcul du temps pour chaque challenge en fonction du niveau
  const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format 'YYYY-MM-DD'

  // Initialiser une liste vide pour stocker les challenges générés
  const challengesList: Challenge[] = [];

  // Boucle pour générer les challenges
  for (let i = 0; i < NUMBER_OF_CHALLENGE; i++) {
    // Sélectionner un exercice aléatoire parmi la liste d'exercices dans le fichier JSON
    const randomExercise = exercises.exercises[Math.floor(Math.random() * exercises.exercises.length)];

    // Créer un objet Challenge avec les informations de l'exercice choisi
    const challengeExercise: Challenge = {
      name: randomExercise.name, // Nom de l'exercice
      description: randomExercise.description, // Description de l'exercice
      primary_muscle: randomExercise.primary_muscle, // Muscle principal sollicité
      secondary_muscles: randomExercise.secondary_muscles, // Muscles secondaires sollicités
      reps: reps, // Nombre de répétitions pour cet exercice
      completed: false, // Initialement l'exercice n'est pas encore complété
      success: false, // L'exercice n'est pas encore réussi
      time: timeChallenge, // Temps du challenge pour cet exercice
      bonus: false, // Pas de bonus par défaut
      malus: false, // Pas de malus par défaut
    };

    // Ajouter le challenge à la liste des challenges
    challengesList.push(challengeExercise);
  }

  // Créer l'objet CompleteChallenge contenant la date et la liste des challenges
  const completeChallenge: CompleteChallenge = {
    date: currentDate, // Date à laquelle les challenges sont générés
    challenges: challengesList // Liste des challenges générés
  };

  // Sauvegarder l'objet completeChallenge dans la base de données sous l'utilisateur spécifique
  await set(ref(database, `users/${userId}/challenges`), completeChallenge);
};

// Export de la fonction pour l'utiliser dans d'autres fichiers
export default createChallenge;
