// components/getDayliExercises
import { getDatabase, ref, set } from 'firebase/database';
import exercises from '../assets/data/exercices.json'; // Importer le fichier JSON
import getNumberOfReps from './calculOfReps';

const getDayliExercises = async (userId: string, level: number) => {
  // Filtrer les exercices par partie du corps
  const upperBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Haut du corps");
  const lowerBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Bas du corps");
  const absExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Ventre");

  // Sélectionner un exercice aléatoire dans chaque catégorie
  const randomUpperBodyExercise = upperBodyExercises[Math.floor(Math.random() * upperBodyExercises.length)];
  const randomLowerBodyExercise = lowerBodyExercises[Math.floor(Math.random() * lowerBodyExercises.length)];
  const randomAbsExercise = absExercises[Math.floor(Math.random() * absExercises.length)];

  // Obtenir le nombre de répétitions en fonction du niveau de l'utilisateur
  const reps = getNumberOfReps(level);
  const currentDate = new Date().toISOString().split('T')[0];

  // Créer l'objet des exercices quotidiens avec le nombre de répétitions, l'attribut "completed", et la date
  const dailyExercises = {
    date: currentDate, // Ajouter la date de génération des exercices
    exercises: [
      { ...randomUpperBodyExercise, reps, completed: false, success: false },
      { ...randomLowerBodyExercise, reps, completed: false, success: false },
      { ...randomAbsExercise, reps, completed: false, success: false },
    ]
  };

  // Stocker les exercices quotidiens dans Firebase pour l'utilisateur
  const db = getDatabase();
  await set(ref(db, `users/${userId}/dailyExercises`), dailyExercises);
};

export default getDayliExercises;