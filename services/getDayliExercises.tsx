import { getDatabase, ref, set } from 'firebase/database'; // Importation des fonctions nécessaires pour interagir avec Firebase
import exercises from '../assets/data/exercices.json'; // Importation du fichier JSON contenant les exercices
import getNumberOfReps from './calculOfReps'; // Importation de la fonction qui calcule le nombre de répétitions en fonction du niveau de l'utilisateur

// Fonction pour générer et stocker les exercices quotidiens pour un utilisateur
const getDailyExercises = async (userId: string, level: number) => {
  // Filtrer les exercices par partie du corps
  const upperBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Haut du corps"); // Exercices pour le haut du corps
  const lowerBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Bas du corps"); // Exercices pour le bas du corps
  const absExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Ventre"); // Exercices pour les abdominaux

  // Sélectionner un exercice aléatoire dans chaque catégorie
  const randomUpperBodyExercise = upperBodyExercises[Math.floor(Math.random() * upperBodyExercises.length)]; // Exercice du haut du corps aléatoire
  const randomLowerBodyExercise = lowerBodyExercises[Math.floor(Math.random() * lowerBodyExercises.length)]; // Exercice du bas du corps aléatoire
  const randomAbsExercise = absExercises[Math.floor(Math.random() * absExercises.length)]; // Exercice des abdos aléatoire

  // Obtenir le nombre de répétitions en fonction du niveau de l'utilisateur
  const reps = getNumberOfReps(level); // Calcul des répétitions en fonction du niveau
  const currentDate = new Date().toISOString().split('T')[0]; // Récupérer la date actuelle au format 'YYYY-MM-DD'

  // Créer l'objet des exercices quotidiens avec les informations nécessaires
  const dailyExercises = {
    date: currentDate, // Ajouter la date à l'objet des exercices
    exercises: [
      { ...randomUpperBodyExercise, reps, completed: false, success: false }, // Exercice haut du corps avec reps, non complété et non réussi
      { ...randomLowerBodyExercise, reps, completed: false, success: false }, // Exercice bas du corps avec reps, non complété et non réussi
      { ...randomAbsExercise, reps, completed: false, success: false }, // Exercice abdos avec reps, non complété et non réussi
    ]
  };

  // Stocker les exercices quotidiens dans la base de données Firebase pour cet utilisateur
  const db = getDatabase(); // Initialiser la base de données Firebase
  await set(ref(db, `users/${userId}/dailyExercises`), dailyExercises); // Sauvegarder les exercices quotidiens sous la référence utilisateur
};

export default getDailyExercises; // Exportation de la fonction pour l'utiliser ailleurs dans l'application
