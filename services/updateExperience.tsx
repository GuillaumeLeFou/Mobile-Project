import { auth, database } from '@/constants/firebase'; // Importation des modules Firebase nécessaires pour l'authentification et la base de données
import { ref, get, update } from 'firebase/database'; // Importation des fonctions pour accéder et mettre à jour les données dans Firebase

// Fonction pour mettre à jour l'expérience de l'utilisateur en fonction de son succès
export const updateExperience = async (
    success: boolean // Paramètre qui détermine si l'utilisateur a réussi ou non une action
): Promise<void> => {
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

        // Vérification si des données utilisateur sont disponibles
        if (!snapshotUser.exists()) {
            console.error('Données utilisateur non trouvées');
            return;
        }

        // Référence pour mettre à jour l'expérience de l'utilisateur
        const experienceRef = ref(database, `/users/${userId}`);

        // Récupérer les données de l'utilisateur
        const userData = snapshotUser.val();
        
        // Récupérer l'expérience actuelle de l'utilisateur (s'il n'y en a pas, initialiser à 0)
        const currentExperience = userData.experience || 0;

        // Si l'action a réussi (succès = true), on augmente l'expérience de 50 points
        if (success) {
            const newExperience = currentExperience + 50;
            
            // Mise à jour de l'expérience dans la base de données
            await update(experienceRef, { experience: newExperience });
        }
        
    } catch (error) {
        // Si une erreur se produit, l'afficher dans la console
        console.error("Erreur lors de la mise à jour de l'expérience", error);
    }
};
