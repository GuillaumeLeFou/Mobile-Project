import { ref, set } from 'firebase/database';
import { database } from '@/constants/firebase';
import exercises from '../assets/data/exercices.json'; // Importer le fichier JSON
import getNumberOfReps from '@/services/calculOfReps';
import { DailyExercise, CompleteExercises } from '@/constants/Interfaces';

export const createDailyExercises = async (
    userId: string,
    level: number
) => {
    const upperBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Haut du corps");
    const lowerBodyExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Bas du corps");
    const absExercises = exercises.exercises.filter(exercise => exercise.partie_du_corps === "Ventre");

    const randomUpperBodyExercise = upperBodyExercises[Math.floor(Math.random() * upperBodyExercises.length)];
    const randomLowerBodyExercise = lowerBodyExercises[Math.floor(Math.random() * lowerBodyExercises.length)];
    const randomAbsExercise = absExercises[Math.floor(Math.random() * absExercises.length)];

    const reps = getNumberOfReps(level);
    const currentDate = new Date().toISOString().split('T')[0];

    const exercisesList: DailyExercise[] = [
        {
            name: randomUpperBodyExercise.name,
            description: randomUpperBodyExercise.description,
            primary_muscle: randomUpperBodyExercise.primary_muscle,
            secondary_muscles: randomUpperBodyExercise.secondary_muscles,
            reps: reps,
            completed: false,
            success: false 
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

    const dailyExercises: CompleteExercises = {
        date: currentDate,
        exercises: exercisesList
    };
    
    await set(ref(database, `users/${userId}/dailyExercises`), dailyExercises);
};
export default createDailyExercises;