import { database } from "@/constants/firebase"; // Importation de la base de données Firebase
import { ref, get } from "firebase/database"; // Importation des fonctions pour accéder aux données dans Firebase
import { Challenge } from "@/constants/Interfaces"; // Assurez-vous que l'interface Challenge est bien définie ici

// Fonction pour récupérer les défis d'un utilisateur par pseudo
export const getChallenge = async (pseudo: string): Promise<Challenge[]> => {
    const usersRef = ref(database, 'users'); // Référence à la base de données des utilisateurs
    const snapshot = await get(usersRef); // Récupère les données de tous les utilisateurs

    let userId: string | null = null; // Initialisation de la variable pour stocker l'ID de l'utilisateur

    // Parcours des utilisateurs pour trouver celui avec le pseudo correspondant
    snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val(); // Récupère les données de l'utilisateur
        if (userData.pseudo === pseudo) { // Si le pseudo de l'utilisateur correspond au pseudo recherché
            userId = childSnapshot.key; // Récupère l'ID de l'utilisateur correspondant
            return true; // Sortir de la boucle une fois l'utilisateur trouvé
        }
        return false; // Continue à parcourir si l'utilisateur n'est pas trouvé
    });

    if (userId) { // Si un utilisateur a été trouvé
        const challengeUserRef = ref(database, `users/${userId}/challenges/challenges`); // Référence aux défis de l'utilisateur
        const snapshotChallenges = await get(challengeUserRef); // Récupère les défis de l'utilisateur

        if (snapshotChallenges.exists()) { // Si des défis existent pour cet utilisateur
            const challenges: Challenge[] = []; // Initialisation d'un tableau pour stocker les défis filtrés
            
            // Parcourir les défis et appliquer les filtres
            snapshotChallenges.forEach((challengeSnapshot) => {
                const challengeData: Challenge = challengeSnapshot.val(); // Récupère les données du défi

                // Vérifie si le défi n'est pas complété et n'a pas de bonus ou malus
                if (!challengeData.completed && !challengeData.bonus && !challengeData.malus) {
                    challenges.push(challengeData); // Ajoute le défi à la liste s'il respecte les conditions
                }
            });

            return challenges; // Retourne la liste des défis filtrés
        }
    }

    return []; // Si aucun défi correspondant n'est trouvé, retourne une liste vide
};
