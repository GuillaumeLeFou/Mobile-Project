import { BonusMalusUpdate } from '@/constants/Interfaces';
import { database } from '@/constants/firebase';
import { ref, get, update } from 'firebase/database';

export const updateBonusMalusChallenge = async (
    pseudo: string, // Utiliser le pseudo pour identifier l'utilisateur
    exerciseTitle: string,
    bonusMalusUpdate: BonusMalusUpdate
) : Promise<void> => {
    try {
        // Référence à la base de données des utilisateurs
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);

        let userId: string | null = null;

        // Parcours des utilisateurs pour trouver celui avec le pseudo correspondant
        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (userData.pseudo === pseudo) {
                userId = childSnapshot.key; // Récupérer l'ID de l'utilisateur
                return true; // Sortir de la boucle une fois trouvé
            }
            return false;
        });
        
        if (userId) {
            // Référence à l'exercice spécifique de l'utilisateur
            const challengesRef = ref(database, `users/${userId}/challenges/challenges`);
            const snapshotChallenges = await get(challengesRef);
            if(snapshotChallenges.exists()){
                const challenges = snapshotChallenges.val();
                const challengeKey = Object.keys(challenges).find(key => challenges[key].name === exerciseTitle);
                if(challengeKey) {
                    const challengeRef = ref(database, `/users/${userId}/challenges/challenges/${challengeKey}`);
                    await update(challengeRef, bonusMalusUpdate);
                } else {
                    console.error('Exercice non trouvé');
                }
            }
        } else {
            console.error("Utilisateur non trouvé");
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du bonus/malus:', error);
    }
};
