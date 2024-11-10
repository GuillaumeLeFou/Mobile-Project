import { StatusUpdate } from '@/constants/Interfaces';
import { auth, database } from '@/constants/firebase';
import { ref, get, update } from 'firebase/database';

export const updateExerciseStatus = async (
    exerciseTitle: string,
    statusUpdate: StatusUpdate
): Promise<void> => {
    try {
        const userId = auth.currentUser?.uid;
        const exercisesRef = ref(database, `/users/${userId}/dailyExercises/exercises`);

        const snapshotExercises = await get(exercisesRef);
        if(snapshotExercises.exists()){
            const exercises = snapshotExercises.val();

            const exerciseKey = Object.keys(exercises).find(key => exercises[key].name === exerciseTitle);

            if(exerciseKey) {
                const exerciseRef = ref(database, `/users/${userId}/dailyExercises/exercises/${exerciseKey}`);

                await update(exerciseRef, statusUpdate);
            } else {
                console.error('Exercice non trouvé');
            }
        }
    } catch (error) {
        console.error('Erreur update');
    }
}