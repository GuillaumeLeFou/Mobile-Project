import { StatusUpdate } from '@/constants/Interfaces';
import { auth, database } from '@/constants/firebase';
import { ref, get, update } from 'firebase/database';

export const updateChallengeStatus = async (
    exerciseTitle: string,
    statusUpdate: StatusUpdate
): Promise<void> => {
    try {
        const userId = auth.currentUser?.uid;
        const challengesRef = ref(database, `/users/${userId}/challenges/challenges`);
        const snapshotChallenges = await get(challengesRef);
        if(snapshotChallenges.exists()){
            const challenges = snapshotChallenges.val();
            const challengeKey = Object.keys(challenges).find(key => challenges[key].name === exerciseTitle);
            if(challengeKey) {
                const challengeRef = ref(database, `/users/${userId}/challenges/challenges/${challengeKey}`);
                await update(challengeRef, statusUpdate);
            } else {
                console.error('Exercice non trouvé');
            }
        }
    } catch (error) {
        console.error('Erreur update');
    }
}