// services/getPlayers.ts

import { database } from "@/constants/firebase";
import { ref, onValue } from "firebase/database";

export const getPlayers = (callback: (players: any[]) => void) => {
  const usersRef = ref(database, 'users');
  onValue(usersRef, (snapshot) => {
    const allPlayers: any[] = [];
    snapshot.forEach((childSnapshot) => {
      const playerData = childSnapshot.val();
      allPlayers.push({
        pseudo: playerData.pseudo,
        niveau: playerData.niveau,
        exp: playerData.experience,
      });
    });

    // Tri des joueurs par niveau et expérience
    const sortedPlayers = allPlayers.sort((a, b) => {
      if (a.niveau !== b.niveau) {
        return b.niveau - a.niveau; // Classement par niveau décroissant
      }
      return b.exp - a.exp; // Classement par expérience décroissante
    });

    // Appeler le callback avec les joueurs triés
    callback(sortedPlayers);
  });
};