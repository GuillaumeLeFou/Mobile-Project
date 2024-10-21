// components/getImageForExercise.ts
const getImageForExercise = (exerciseName: string) => {
  const exerciseImageMap: { [key: string]: any } = {
    "pompes": [
      require('../assets/images/Push-ups-1.png'),
      require('../assets/images/Push-ups-2.png')
    ],
    // "squats": require('../assets/images/Squats.png'),
    // Ajoutez d'autres correspondances ici
  };

  // Retourne l'image correspondant à l'exercice ou une image par défaut si aucune correspondance n'est trouvée
  return exerciseImageMap[exerciseName.toLowerCase()] || [];
};

export default getImageForExercise;