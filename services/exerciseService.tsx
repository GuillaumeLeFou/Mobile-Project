import { auth, database } from '@/constants/firebase';
import { ref, get, update } from 'firebase/database'; // Importation des fonctions nécessaires

// Définition des types pour les paramètres de la fonction
interface StatusUpdate {
    completed: boolean;
    success: boolean;
}

export const updateExerciseStatus = async (exerciseTitle: string, statusUpdate: StatusUpdate): Promise<void> => {
    try {
        const userId = auth.currentUser?.uid; // Obtenir l'ID de l'utilisateur connecté
        if (!userId) throw new Error("Utilisateur non connecté");

        // Référence vers les exercices quotidiens de l'utilisateur
        const exercisesRef = ref(database, `/users/${userId}/dailyExercises/exercises`);

        // Récupérer la liste des exercices
        const snapshot = await get(exercisesRef);
        if (snapshot.exists()) {
            const exercises = snapshot.val();

            // Trouver l'exercice correspondant par son nom (title)
            const exerciseKey = Object.keys(exercises).find(key => exercises[key].name === exerciseTitle);
            
            if (exerciseKey) {
                // Référence vers l'exercice à mettre à jour
                const exerciseRef = ref(database, `/users/${userId}/dailyExercises/exercises/${exerciseKey}`);
                
                // Mettre à jour les champs "completed" et "success"
                await update(exerciseRef, statusUpdate);
                console.log("Statut de l'exercice mis à jour avec succès !");
            } else {
                console.error("Exercice non trouvé");
            }
        } else {
            console.error("Aucun exercice trouvé pour cet utilisateur");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'exercice :", error);
    }
};
