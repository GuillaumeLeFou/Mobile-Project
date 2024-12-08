import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, TextInput, Button, PaperProvider, Snackbar } from "react-native-paper";
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase pour l'authentification
import { auth, database } from '@/constants/firebase'; // Importation de la configuration Firebase
import { get, ref, set } from 'firebase/database'; // Firebase Realtime Database
import { useRouter } from 'expo-router'; // Utilisation du router pour la navigation
import { useDynamicStyles } from '@/constants/Styles'; // Styles dynamiques
import { useDynamicStylesComponents } from '@/constants/componentsStyles'; // Styles spécifiques aux composants

const Registration = () => {
    const router = useRouter();  // Initialisation du router pour la navigation
    const [email, setEmail] = useState('');  // État pour l'email
    const [password, setPassword] = useState('');  // État pour le mot de passe
    const [pseudo, setPseudo] = useState('');  // État pour le pseudo
    const [error, setError] = useState('');  // État pour l'erreur
    const [visible, setVisible] = useState(false);  // Contrôle la visibilité du Snackbar d'erreur
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents(); // Styles dynamiques
    const styles = useDynamicStyles();  // Récupère les styles dynamiques

    // Réinitialise les champs lorsque le composant se monte
    useEffect(() => {
        setEmail('');
        setPassword('');
        setPseudo('');
        setError('');
    }, []);

    // Fonction pour fermer le Snackbar
    const onDismissSnackBar = () => setVisible(false);

    // Vérifie si le pseudo existe déjà dans la base de données
    const checkIfPseudoExists = async (pseudo: string): Promise<boolean> => {
        const pseudoRef = ref(database, 'users');  // Référence à la collection "users" dans la base de données
        const snapshot = await get(pseudoRef);  // Récupère les données de "users"
        const users = snapshot.val();  // Récupère les données sous forme d'objet

        // Parcourt tous les utilisateurs pour vérifier si le pseudo existe déjà
        for (let key in users) {
            if (users[key].pseudo === pseudo) {
                return true;  // Retourne true si le pseudo existe déjà
            }
        }
        return false;  // Retourne false si le pseudo est disponible
    };

    // Fonction pour gérer l'inscription
    const handleRegister = async () => {
        if (!email || !password || !pseudo) {
            setError('Veuillez remplir tous les champs');  // Vérifie que tous les champs sont remplis
            setVisible(true);  // Affiche le message d'erreur
            return;
        }

        const pseudoExists = await checkIfPseudoExists(pseudo);  // Vérifie si le pseudo existe
        if (pseudoExists) {
            setError('Le pseudo existe déjà. Veuillez en choisir un autre');  // Affiche un message d'erreur si le pseudo est déjà pris
            setVisible(true);  // Affiche le message d'erreur
            return;
        }

        try {
            // Crée un nouvel utilisateur avec l'email et le mot de passe
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Enregistre l'utilisateur dans la base de données Firebase Realtime Database
            await set(ref(database, 'users/' + user.uid), {
                email: user.email,
                pseudo: pseudo,
                experience: 0,  // Initialisation de l'expérience de l'utilisateur
                goalExperience: 100,  // Expérience nécessaire pour atteindre le niveau suivant
                niveau: 1,  // Niveau initial de l'utilisateur
                challenges: {
                    bonus: false,  // Statut du challenge bonus
                    malus: false,  // Statut du challenge malus
                    reps: 0,  // Nombre de répétitions pour le challenge
                    timeChallenge: 0,  // Temps pour le challenge
                    challenge: {},  // Initialisation du challenge avec un objet vide
                },
                dailyExercises: {
                    date: '',  // Date du dernier exercice effectué
                    exercises: {}  // Liste des exercices quotidiens
                },
            });

            router.replace('/');  // Redirige l'utilisateur vers la page d'accueil après l'inscription
        } catch (error: any) {
            const errorMessage = error.message;  // Récupère le message d'erreur
            setError(errorMessage);  // Affiche l'erreur
            setVisible(true);  // Affiche le Snackbar avec l'erreur
        }
    };

    return (
        <PaperProvider>
        <View style={styles.containerConexionInscription}>
            <Text style={styles.title}>Inscription</Text>
            {/* Champ de saisie pour l'email */}
            <TextInput 
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input} 
                {...textInputStyles}  // Applique les styles dynamiques
            />
            {/* Champ de saisie pour le mot de passe */}
            <TextInput 
                mode="outlined"
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry  // Masque le mot de passe
                style={styles.input} 
                {...textInputStyles}  // Applique les styles dynamiques
            />
            {/* Champ de saisie pour le pseudo */}
            <TextInput 
                mode="outlined"
                label="Pseudo" 
                value={pseudo}
                onChangeText={setPseudo}
                style={styles.input} 
                {...textInputStyles}  // Applique les styles dynamiques
            />
            {/* Bouton d'inscription */}
            <Button mode="contained" onPress={handleRegister} {...buttonStyle}>
                Inscription
            </Button>
            {/* Lien vers la page de connexion si l'utilisateur est déjà inscrit */}
            <TouchableOpacity onPress={() => router.replace('/')}>
                <Text style={styles.textRegistration}>Déjà inscrit ?</Text>
            </TouchableOpacity>
            {/* Snackbar affichant les erreurs */}
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}  // Ferme le Snackbar
                duration={3000}  // Durée de l'affichage du Snackbar
            >
                {error}  {/* Affiche le message d'erreur */}
            </Snackbar>
        </View>
        </PaperProvider>
    );
};

export default Registration;
