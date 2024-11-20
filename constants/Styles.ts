import { Colors } from './Colors';
import { StyleSheet, useColorScheme } from 'react-native';

export const useDynamicStyles = () => {
  const theme = useColorScheme(); // Récupère le thème 'light' ou 'dark'

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    
    containerConexionInscription: {
      flex: 1,
      padding: 16,
      backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
      justifyContent: 'center',
    },

    title: {
      color: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      fontSize: 34,
      marginBottom: 12,
      marginTop: 40,
      fontWeight: 'bold',
      textAlign: 'center',
    },

    input: {
      marginBottom: 12,
    },

    textRegistration: {
      marginTop: 10,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      textAlign: 'center',
      fontSize: 20,
    },

    cardCover: {
      height: 150,
      width: 150,
      resizeMode: 'contain',
      backgroundColor: 'rgba(0,0,0,0)',
      padding: 10,
    },

    cardSuccess: {
      borderColor: 'green',
      borderWidth: 2,
    },

    cardFailure: {
      borderColor: 'red',
      borderWidth: 2,
    },

    subtitle: {
      color: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 8,
    },

    subSubtitle: { 
      color: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      fontSize: 18,
      marginBottom: 5,
      fontWeight: 'bold',
    },

    paragraph: {
      fontSize: 18,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      lineHeight: 26,
      textAlign: 'justify',
      marginBottom: 16,
    },

    divider: {
      backgroundColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      marginBottom: 10,
    },

    image: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      margin: 10,
    },

    imageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    exerciseButton: {
      flex: 1,
      justifyContent: 'flex-end',
    },

    result: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 10,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },

    rankStyleHeader: {
      margin: 10,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },

    rankStyleTitle: {
      fontSize: 30,
    },

    timer: {
      fontSize: 20,
      marginVertical: 10,
      fontWeight: 'bold',
      color: '#FF4500',
  },
  });
};
