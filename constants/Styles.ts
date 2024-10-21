// Styles.ts
import { Colors } from './Colors';
import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.customeStyle.backgroud
  },
  
  title: {
    color: Colors.customeStyle.darkBlue,
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center', // Assurez-vous que textAlign utilise une valeur valide
  },

  input: {
    marginBottom: 12, // Style général pour les marges
  },

  textRegistration: {
    marginTop: 10,
    color: Colors.customeStyle.darkBlue,
    textAlign: 'center',
    fontSize: 20,
  }
});
