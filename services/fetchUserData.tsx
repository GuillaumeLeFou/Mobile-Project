import { auth, database } from "@/constants/firebase"; // Importation de l'authentification et de la base de données Firebase
import { ref, onValue } from "firebase/database"; // Importation des fonctions pour accéder aux données dans Firebase
import { useState, useEffect } from "react"; // Importation de React hooks (useState, useEffect)
import { UserData } from "@/constants/Interfaces"; // Importation du type UserData pour définir les données utilisateur

// Fonction pour récupérer les données de l'utilisateur
export const fetchUserData = () => {
  const [loading, setLoading] = useState(true); // État pour indiquer si les données sont en cours de chargement
  const [userData, setUserData] = useState<UserData>( { // État pour stocker les données de l'utilisateur
    pseudo: null, // Pseudo de l'utilisateur
    userId: null, // ID de l'utilisateur
    image: null, // Image de profil de l'utilisateur
    exp: null, // Expérience de l'utilisateur
    goalExp: null, // Objectif d'expérience de l'utilisateur
    niveau: null, // Niveau de l'utilisateur
    dailyExercises: null, // Exercices quotidiens de l'utilisateur
    challenges: null, // Challenges de l'utilisateur
  });

  useEffect(() => {
    // Utilisation de useEffect pour récupérer les données de l'utilisateur une seule fois lors du montage du composant
    const user = auth.currentUser; // Récupère l'utilisateur actuel depuis Firebase Auth
    if (user) {
      // Si l'utilisateur est connecté
      const userRef = ref(database, `users/${user.uid}`); // Référence à la base de données de l'utilisateur via son UID
      onValue(userRef, (snapshot) => { // Écoute les changements dans la base de données
        const data = snapshot.val(); // Récupère les données de l'utilisateur dans la base de données
        setUserData({
          pseudo: data?.pseudo || null, // Si le pseudo existe, l'ajoute, sinon null
          userId: user.uid, // Définit l'ID de l'utilisateur
          image: data?.image || null, // Si l'image existe, l'ajoute, sinon null
          exp: data?.experience || 0, // Définit l'expérience de l'utilisateur, 0 si non défini
          goalExp: data?.goalExp || 100, // Définit l'objectif d'expérience de l'utilisateur, 100 par défaut
          niveau: data?.niveau || 0, // Définit le niveau de l'utilisateur, 0 par défaut
          dailyExercises: data?.dailyExercises, // Récupère les exercices quotidiens de l'utilisateur
          challenges: data?.challenges, // Récupère les challenges de l'utilisateur
        });
        setLoading(false); // Données récupérées, mise à jour du statut de chargement
      });
    } else {
      setLoading(false); // Si l'utilisateur n'est pas connecté, on arrête le chargement
    }
  }, []); // Le tableau vide [] signifie que ce useEffect s'exécute une seule fois lors du montage

  return { userData, loading }; // Retourne les données de l'utilisateur et l'état de chargement
};
