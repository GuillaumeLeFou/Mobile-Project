import { StatusUpdate } from '@/constants/Interfaces'; // Importation de l'interface StatusUpdate, qui définit le format des données de mise à jour de statut.
import { auth, database } from '@/constants/firebase'; // Importation des modules nécessaires pour accéder à l'authentification et à la base de données Firebase.
import { ref, get, update } from 'firebase/database'; // Importation des fonctions Firebase nécessaires pour accéder et mettre à jour les données.

export const updateChallengeStatus = async (
    exerciseTitle: string, // Le titre de l'exercice dont le statut doit être mis à jour.
    statusUpdate: StatusUpdate // Les données de mise à jour du statut (ex: complété, succès, etc.).
): Promise<void> => {
    try {
        // Récupérer l'ID de l'utilisateur actuellement authentifié
        const userId = auth.currentUser?.uid;

        if (!userId) {
            console.error("Utilisateur non authentifié");
            return;
        }

        // Référence à la base de données pour les challenges de l'utilisateur
        const challengesRef = ref(database, `/users/${userId}/challenges/challenges`);

        // Récupérer les données des challenges de l'utilisateur
        const snapshotChallenges = await get(challengesRef);

        // Vérifier si des données sont présentes pour les challenges
        if (snapshotChallenges.exists()) {
            const challenges = snapshotChallenges.val(); // Récupérer toutes les données des challenges

            // Chercher la clé du challenge correspondant à l'exercice dont le titre est passé en paramètre
            const challengeKey = Object.keys(challenges).find(key => challenges[key].name === exerciseTitle);

            if (challengeKey) {
                // Si le challenge est trouvé, récupérer sa référence dans la base de données
                const challengeRef = ref(database, `/users/${userId}/challenges/challenges/${challengeKey}`);
                
                // Mettre à jour le challenge avec les nouvelles données de statut
                await update(challengeRef, statusUpdate);
            } else {
                // Si l'exercice n'est pas trouvé, afficher une erreur
                console.error('Exercice non trouvé');
            }
        } else {
            console.error('Aucun challenge trouvé pour cet utilisateur');
        }
    } catch (error) {
        // En cas d'erreur, afficher un message d'erreur
        console.error('Erreur lors de la mise à jour du challenge', error);
    }
}
