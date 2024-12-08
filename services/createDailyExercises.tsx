import { ref, set } from 'firebase/database';
import { database } from '@/constants/firebase';
import exercises from '../assets/data/exercices.json'; // Importation des données d'exercices depuis un fichier JSON
import getNumberOfReps from '@/services/calculOfReps'; // Importation de la fonction pour calculer les répétitions en fonction du niveau
import { DailyExercise, CompleteExercises } from '@/constants/Interfaces'; // Importation des types nécessaires

// Fonction pour créer les exercices quotidiens pour un utilisateur en fonction de son niveau
export const createDailyExercises = async (
    userId: string, // ID de l'utilisateur pour associer les exercices à celui-ci
    level: number // Niveau de l'utilisateur pour déterminer le nombre de répétitions
) => {
    // Filtrage des exercices par partie du corps
    const upperBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Haut du corps");
    const lowerBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Bas du corps");
    const absExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Ventre");

    // Sélection aléatoire d'un exercice dans chaque catégorie (haut du corps, bas du corps, abdominaux)
    const randomUpperBodyExercise = upperBodyExercises[Math.floor(Math.random() * upperBodyExercises.length)];
    const randomLowerBodyExercise = lowerBodyExercises[Math.floor(Math.random() * lowerBodyExercises.length)];
    const randomAbsExercise = absExercises[Math.floor(Math.random() * absExercises.length)];

    // Calcul du nombre de répétitions pour chaque exercice en fonction du niveau de l'utilisateur
    const reps = getNumberOfReps(level);

    // Récupération de la date actuelle au format ISO (YYYY-MM-DD)
    const currentDate = new Date().toISOString().split('T')[0];

    // Création de la liste des trois exercices quotidiens
    const exercisesList: DailyExercise[] = [
        {
            name: randomUpperBodyExercise.name, // Nom de l'exercice
            description: randomUpperBodyExercise.description, // Description de l'exercice
            primary_muscle: randomUpperBodyExercise.primary_muscle, // Muscle principal travaillé
            secondary_muscles: randomUpperBodyExercise.secondary_muscles, // Muscles secondaires travaillés
            reps: reps, // Nombre de répétitions
            completed: false, // Statut initial, false signifie non complété
            success: false // Statut initial, false signifie non réussi
        },
        {
            name: randomLowerBodyExercise.name,
            description: randomLowerBodyExercise.description,
            primary_muscle: randomLowerBodyExercise.primary_muscle,
            secondary_muscles: randomLowerBodyExercise.secondary_muscles,
            reps: reps,
            completed: false,
            success: false
        },
        {
            name: randomAbsExercise.name,
            description: randomAbsExercise.description,
            primary_muscle: randomAbsExercise.primary_muscle,
            secondary_muscles: randomAbsExercise.secondary_muscles,
            reps: reps,
            completed: false,
            success: false
        }
    ];

    // Création de l'objet CompleteExercises qui inclut la date et la liste des exercices
    const dailyExercises: CompleteExercises = {
        date: currentDate, // Date actuelle
        exercises: exercisesList // Liste des exercices du jour
    };

    // Sauvegarde des exercices quotidiens dans la base de données Firebase sous l'ID de l'utilisateur
    await set(ref(database, `users/${userId}/dailyExercises`), dailyExercises);
};

export default createDailyExercises;
