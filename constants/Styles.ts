// Styles.ts
import { Colors } from './Colors';
import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.customeStyle.backgroud
  },

  containerConexionInscription: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.customeStyle.backgroud,
    justifyContent: 'center', // Centre le contenu verticalement
  },
  
  title: {
    color: Colors.customeStyle.darkBlue,
    fontSize: 34, // Taille de police réduite pour mieux s'adapter
    marginBottom: 12, // Espacement réduit pour un rendu plus subtil
    marginTop: 40,
    fontWeight: 'bold', // Utilisation d'une police en gras pour un effet professionnel
    textAlign: 'center',
  },

  input: {
    marginBottom: 12, // Style général pour les marges
  },

  textRegistration: {
    marginTop: 10,
    color: Colors.customeStyle.darkBlue,
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
    color: Colors.customeStyle.darkBlue, // Couleur plus douce pour les sous-titres
    fontSize: 24, // Taille réduite pour une hiérarchie plus claire
    fontWeight: '600', // Sous-titres légèrement gras
    marginBottom: 8,
  },
  subSubtitle: { // Nouveau style pour le sous-sous-titre
    color: Colors.customeStyle.darkBlue,
    fontSize: 18, // Taille un peu plus petite que le sous-titre
    marginBottom: 5,
    fontWeight: 'bold', // Met en gras pour le distinguer
  },
  paragraph: {
    fontSize: 18, // Taille standardisée pour un meilleur confort de lecture
    color: Colors.customeStyle.text, // Couleur de texte plus douce pour une lecture prolongée
    lineHeight: 26, // Espacement entre les lignes pour un meilleur confort
    textAlign: 'justify', // Alignement justifié pour un aspect plus propre
    marginBottom: 16,
  },

  divider: {
    backgroundColor: Colors.customeStyle.text,
    marginBottom: 10,
  },

  image: {
    width: 150, // Utiliser 100% de la largeur de la vue parente
    height: 150, // Hauteur fixe de 200 pixels
    resizeMode: 'contain', // Conserver le rapport hauteur/largeur
    margin: 10,
  },

  imageContainer: {
    flexDirection: 'row', // Aligne les éléments horizontalement
    justifyContent: 'space-between', // Espace entre les images
  },

  exerciseButton: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  result: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    color: Colors.customeStyle.darkBlue,
},
});
