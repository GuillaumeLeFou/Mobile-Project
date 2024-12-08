import { BonusMalusUpdate } from '@/constants/Interfaces'; // Importation de l'interface BonusMalusUpdate qui définit la structure des données de bonus/malus
import { database } from '@/constants/firebase'; // Importation de la base de données Firebase
import { ref, get, update } from 'firebase/database'; // Importation des fonctions nécessaires pour lire et mettre à jour les données dans Firebase

// Fonction pour mettre à jour un bonus/malus pour un défi spécifique d'un utilisateur
export const updateBonusMalusChallenge = async (
    pseudo: string, // Pseudo de l'utilisateur (identifiant)
    exerciseTitle: string, // Titre de l'exercice (nom du défi)
    bonusMalusUpdate: BonusMalusUpdate // Objet contenant les informations du bonus/malus à appliquer
) : Promise<void> => {
    try {
        // Référence à la base de données des utilisateurs
        const usersRef = ref(database, 'users');
        
        // Récupérer toutes les données des utilisateurs
        const snapshot = await get(usersRef);

        let userId: string | null = null;

        // Parcours de tous les utilisateurs pour trouver celui dont le pseudo correspond
        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val(); // Récupérer les données de l'utilisateur
            if (userData.pseudo === pseudo) {
                userId = childSnapshot.key; // Si le pseudo correspond, on enregistre l'ID de l'utilisateur
                return true; // On arrête la boucle une fois l'utilisateur trouvé
            }
            return false;
        });
        
        // Si un utilisateur correspondant est trouvé
        if (userId) {
            // Référence à la collection des défis de cet utilisateur
            const challengesRef = ref(database, `users/${userId}/challenges/challenges`);
            
            // Récupérer les défis de l'utilisateur
            const snapshotChallenges = await get(challengesRef);
            
            // Vérifier si des défis existent pour cet utilisateur
            if(snapshotChallenges.exists()){
                const challenges = snapshotChallenges.val(); // Récupérer les défis
                // Trouver le défi correspondant à l'exercice basé sur le titre
                const challengeKey = Object.keys(challenges).find(key => challenges[key].name === exerciseTitle);
                
                if(challengeKey) {
                    // Si le défi est trouvé, obtenir la référence de cet exercice précis
                    const challengeRef = ref(database, `/users/${userId}/challenges/challenges/${challengeKey}`);
                    
                    // Mettre à jour le défi avec les informations de bonus/malus
                    await update(challengeRef, bonusMalusUpdate);
                } else {
                    // Si le défi n'a pas été trouvé, afficher un message d'erreur
                    console.error('Exercice non trouvé');
                }
            }
        } else {
            // Si l'utilisateur n'est pas trouvé, afficher un message d'erreur
            console.error("Utilisateur non trouvé");
        }
    } catch (error) {
        // Si une erreur survient, l'afficher dans la console
        console.error('Erreur lors de la mise à jour du bonus/malus:', error);
    }
};
