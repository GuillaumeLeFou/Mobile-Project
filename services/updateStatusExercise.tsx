import { StatusUpdate } from '@/constants/Interfaces'; // Importation de l'interface StatusUpdate, qui définit la structure des données de mise à jour du statut d'un exercice.
import { auth, database } from '@/constants/firebase'; // Importation des modules nécessaires pour accéder à l'authentification et à la base de données Firebase.
import { ref, get, update } from 'firebase/database'; // Importation des fonctions nécessaires de Firebase pour accéder aux données et les mettre à jour.

export const updateExerciseStatus = async (
    exerciseTitle: string, // Le titre de l'exercice dont le statut doit être mis à jour.
    statusUpdate: StatusUpdate // Les données de mise à jour du statut de l'exercice (ex: complété, succès, etc.).
): Promise<void> => {
    try {
        // Récupérer l'ID de l'utilisateur actuellement authentifié
        const userId = auth.currentUser?.uid;

        if (!userId) {
            console.error("Utilisateur non authentifié");
            return;
        }

        // Référence à la base de données pour les exercices quotidiens de l'utilisateur
        const exercisesRef = ref(database, `/users/${userId}/dailyExercises/exercises`);

        // Récupérer les données des exercices quotidiens de l'utilisateur
        const snapshotExercises = await get(exercisesRef);

        // Vérifier si des données existent pour les exercices
        if (snapshotExercises.exists()) {
            const exercises = snapshotExercises.val(); // Récupérer toutes les données des exercices quotidiens

            // Chercher la clé de l'exercice correspondant au titre passé en paramètre
            const exerciseKey = Object.keys(exercises).find(key => exercises[key].name === exerciseTitle);

            if (exerciseKey) {
                // Si l'exercice est trouvé, récupérer sa référence dans la base de données
                const exerciseRef = ref(database, `/users/${userId}/dailyExercises/exercises/${exerciseKey}`);
                
                // Mettre à jour l'exercice avec les nouvelles données de statut
                await update(exerciseRef, statusUpdate);
            } else {
                // Si l'exercice n'est pas trouvé, afficher un message d'erreur
                console.error('Exercice non trouvé');
            }
        }
    } catch (error) {
        // En cas d'erreur, afficher un message d'erreur dans la console
        console.error('Erreur lors de la mise à jour de l\'exercice', error);
    }
}
