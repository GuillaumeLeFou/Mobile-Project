import { auth, database } from '@/constants/firebase';
import { ref, get, update } from 'firebase/database';

export const updateGoalExperience = async (): Promise<void> => {
    try {
        const userId = auth.currentUser?.uid;

        const userRef = ref(database, `/users/${userId}`);
        const snapshotUser = await get(userRef);

        const userData = snapshotUser.val();
        const currentExperience = userData.experience || 0;
        const currentLevel = userData.niveau || 1;
        const currentGoalExperience = userData.goalExperience;
        const newGoalExperience = (currentLevel+1)*100;

        let newLevel = currentLevel;
        if(currentExperience >= currentGoalExperience){
            newLevel++;
        }
        if (newLevel !== currentLevel) {
            await update(userRef, {
                goalExperience : newGoalExperience,
                niveau: newLevel
            });
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du 'goal experience'", error);
    }
};
