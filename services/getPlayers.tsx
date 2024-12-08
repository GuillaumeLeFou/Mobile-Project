// services/getPlayers.ts

import { database } from "@/constants/firebase"; // Importation de la base de données Firebase
import { ref, onValue } from "firebase/database"; // Importation des méthodes pour lire les données dans Firebase

// Fonction qui récupère les joueurs depuis Firebase et les trie
export const getPlayers = (callback: (players: any[]) => void) => {
  // Référence à la base de données 'users', où les informations des joueurs sont stockées
  const usersRef = ref(database, 'users');
  
  // Écoute les changements sur les données des utilisateurs dans la base de données Firebase
  onValue(usersRef, (snapshot) => {
    const allPlayers: any[] = []; // Tableau pour stocker les données de tous les joueurs
    
    // Parcours de chaque joueur dans les données récupérées
    snapshot.forEach((childSnapshot) => {
      const playerData = childSnapshot.val(); // Récupération des données du joueur
      allPlayers.push({
        pseudo: playerData.pseudo, // Récupère le pseudo du joueur
        niveau: playerData.niveau, // Récupère le niveau du joueur
        exp: playerData.experience, // Récupère l'expérience du joueur
      });
    });

    // Tri des joueurs d'abord par niveau, puis par expérience
    const sortedPlayers = allPlayers.sort((a, b) => {
      if (a.niveau !== b.niveau) {
        return b.niveau - a.niveau; // Si les niveaux sont différents, trier par niveau décroissant
      }
      return b.exp - a.exp; // Si les niveaux sont identiques, trier par expérience décroissante
    });

    // Appeler le callback passé en paramètre avec les joueurs triés
    callback(sortedPlayers);
  });
};
