import { database } from "@/constants/firebase";
import { ref, get } from "firebase/database";
import { Challenge } from "@/constants/Interfaces"; // Assurez-vous que l'interface Challenge est bien définie ici

export const getChallenge = async (pseudo: string): Promise<Challenge[]> => {
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
        const challengeUserRef = ref(database, `users/${userId}/challenges/challenges`);
        const snapshotChallenges = await get(challengeUserRef);

        if (snapshotChallenges.exists()) {
            const challenges: Challenge[] = [];
            
            // Parcourir les défis pour appliquer les filtres
            snapshotChallenges.forEach((challengeSnapshot) => {
                const challengeData: Challenge = challengeSnapshot.val();

                // Vérifier si le défi n'est pas complété et n'a pas de bonus/malus
                if (!challengeData.completed && !challengeData.bonus && !challengeData.malus) {
                    challenges.push(challengeData);
                }
            });

            return challenges; // Retourner la liste des défis filtrés
        }
    }

    return []; // Retourner une liste vide si aucun défi correspondant n'est trouvé
};
