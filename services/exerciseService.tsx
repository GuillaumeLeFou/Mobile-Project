import { database } from '@/constants/firebase'; // Assurez-vous d'importer votre configuration Firebase
import { ref, update } from 'firebase/database'; // Importer les fonctions nécessaires

// Définition des types pour les paramètres de la fonction
interface StatusUpdate {
    completed: boolean;
    success: boolean;
}

export const updateExerciseStatus = async (exerciseTitle: string, statusUpdate: StatusUpdate): Promise<void> => {
    try {
        const exerciseRef = ref(database, `exercises/${exerciseTitle}`);
        console.log("Mise à jour dans le chemin :", exerciseRef.toString());
        console.log("Données à mettre à jour :", statusUpdate);
        
        await update(exerciseRef, statusUpdate);
        console.log("Statut de l'exercice mis à jour avec succès !");
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'exercice :", error);
    }
};
