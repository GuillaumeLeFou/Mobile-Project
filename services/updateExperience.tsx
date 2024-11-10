import { auth, database } from '@/constants/firebase';
import { ref, get, update } from 'firebase/database';

export const updateExperience = async (
    success: boolean
): Promise<void> => {
    try {
        const userId = auth.currentUser?.uid;

        const userRef = ref(database, `/users/${userId}`);
        const snapshotUser = await get(userRef);

        const experienceRef = ref(database, `/users/${userId}`);

        const userData = snapshotUser.val();
        const currentExperience = userData.experience || 0;
        if(success){
            const newExperience = currentExperience + 50;
            await update(experienceRef, { experience: newExperience});
        }
        
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'expérience", error);
    }
};
