// components/getImageForExercise.ts

// Fonction qui retourne les images correspondantes à un exercice donné
const getImageForExercise = (exerciseName: string) => {
  // Création d'un objet qui mappe les noms d'exercices à leurs images
  const exerciseImageMap: { [key: string]: any } = {
    "pompes": [
      require('@/assets/images/exercises/push-ups-1.png'), // Image 1 des pompes
      require('@/assets/images/exercises/push-ups-2.png')  // Image 2 des pompes
    ],
    // Vous pouvez ajouter d'autres correspondances d'exercices ici, par exemple :
    // "squats": require('../assets/images/Squats.png'), // Exercice des squats
  };

  // Retourne les images correspondant à l'exercice, en tenant compte de la casse
  // Si l'exercice n'est pas trouvé dans le mappage, retourne un tableau vide
  return exerciseImageMap[exerciseName.toLowerCase()] || [];
};

export default getImageForExercise; // Export de la fonction pour utilisation dans d'autres fichiers
