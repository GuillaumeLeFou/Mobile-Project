import { auth, database } from '@/constants/firebase'; // Importation des modules nécessaires pour l'authentification et la base de données
import { ref, get, update } from 'firebase/database'; // Importation des fonctions de Firebase pour accéder aux données et les mettre à jour

// Fonction pour mettre à jour l'objectif d'expérience (goalExperience) et le niveau de l'utilisateur
export const updateGoalExperience = async (): Promise<void> => {
    try {
        // Récupérer l'ID de l'utilisateur actuellement connecté
        const userId = auth.currentUser?.uid;

        if (!userId) {
            console.error('Utilisateur non authentifié');
            return;
        }

        // Référence à l'utilisateur dans la base de données
        const userRef = ref(database, `/users/${userId}`);
        
        // Récupérer les données de l'utilisateur
        const snapshotUser = await get(userRef);

        // Vérifier si des données utilisateur sont disponibles
        if (!snapshotUser.exists()) {
            console.error('Données utilisateur non trouvées');
            return;
        }

        // Récupérer les données de l'utilisateur
        const userData = snapshotUser.val();

        // Récupérer l'expérience actuelle, le niveau actuel, et l'objectif d'expérience actuel
        const currentExperience = userData.experience || 0;
        const currentLevel = userData.niveau || 1;
        const currentGoalExperience = userData.goalExperience;

        // Calculer le nouvel objectif d'expérience en fonction du niveau de l'utilisateur
        const newGoalExperience = (currentLevel + 1) * 100;

        // Initialiser la variable pour le nouveau niveau
        let newLevel = currentLevel;

        // Si l'utilisateur a suffisamment d'expérience pour atteindre le prochain niveau
        if (currentExperience >= currentGoalExperience) {
            newLevel++; // Augmenter le niveau
        }

        // Si le niveau a changé, mettre à jour la base de données avec le nouveau niveau et l'objectif d'expérience
        if (newLevel !== currentLevel) {
            await update(userRef, {
                goalExperience: newGoalExperience, // Mettre à jour l'objectif d'expérience pour le prochain niveau
                niveau: newLevel // Mettre à jour le niveau de l'utilisateur
            });
        }
    } catch (error) {
        // Si une erreur se produit, l'afficher dans la console
        console.error("Erreur lors de la mise à jour du 'goal experience'", error);
    }
};
