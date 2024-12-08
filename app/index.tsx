import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { TextInput, Button, Text, Snackbar, PaperProvider } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/constants/firebase';
import { useRouter } from 'expo-router';
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';

// Déclaration du composant LoginScreen
const LoginScreen: React.FC = () => {
    const router = useRouter();  // Utilise le router pour la navigation
    const [email, setEmail] = useState('');  // État pour l'email de l'utilisateur
    const [password, setPassword] = useState('');  // État pour le mot de passe de l'utilisateur
    const [error, setError] = useState('');  // État pour afficher une erreur lors de la connexion
    const [visible, setVisible] = useState(false);  // Contrôle la visibilité du Snackbar d'erreur
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents(); // Récupère les styles dynamiques
    const styles = useDynamicStyles();  // Récupère les styles dynamiques du projet

    // Réinitialise les champs lors du montage du composant
    useEffect(() => {
        setEmail('');
        setPassword('');
        setError('');
    }, []);

    // Fonction pour gérer la connexion de l'utilisateur
    const handleLogin = async () => {
        try {
            // Essaye de se connecter avec Firebase
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/home');  // Si succès, redirige vers la page d'accueil
        } catch (err) {
            // Si échec, affiche un message d'erreur
            setError('Échec de la connexion. Vérifiez vos identifiants.');
            setVisible(true);  // Affiche le Snackbar
        }
    };

    // Fonction pour fermer le Snackbar
    const onDismissSnackBar = () => setVisible(false);

    return (
      <PaperProvider>
        <View style={styles.containerConexionInscription}>
            <Text style={styles.title}>Connexion</Text>
            {/* Champ de saisie de l'email */}
            <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                {...textInputStyles}  // Applique les styles dynamiques pour le champ de texte
            />
            {/* Champ de saisie du mot de passe */}
            <TextInput
                mode="outlined"
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry  // Masque le texte saisi pour le mot de passe
                style={styles.input}
                {...textInputStyles}  // Applique les styles dynamiques pour le champ de texte
            />
            {/* Bouton de connexion */}
            <Button
                mode="contained"
                onPress={handleLogin}  // Appelle la fonction handleLogin lors du clic
                {...buttonStyle}  // Applique les styles dynamiques pour le bouton
            >
                Se connecter
            </Button>
            {/* Lien vers la page d'inscription */}
            <TouchableOpacity onPress={() => router.push('/registration')}>
                <Text style={styles.textRegistration}>Pas encore de compte ?</Text>
            </TouchableOpacity>
            {/* Affiche un Snackbar en cas d'erreur */}
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}  // Ferme le Snackbar lorsqu'on le dissipe
                duration={3000}  // Durée d'affichage du Snackbar (3 secondes)
            >
                {error}  {/* Affiche l'erreur */}
            </Snackbar>
        </View>
      </PaperProvider>
    );
};

export default LoginScreen;
