import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, TextInput, Button, PaperProvider, Snackbar } from "react-native-paper";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '@/constants/firebase';
import { get, ref, set } from 'firebase/database';
import { useRouter } from 'expo-router';
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';

const Registration = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setPseudo('');
        setError('');
    }, []);

    const onDismissSnackBar = () => setVisible(false);

    const checkIfPseudoExists = async (pseudo: string): Promise<boolean> => {
        const pseudoRef = ref(database, 'users');
        const snapshot = await get(pseudoRef);
        const users = snapshot.val();

        for (let key in users) {
            if (users[key].pseudo === pseudo) {
                return true;
            }
        }
        return false;
    };

    const handleRegister = async () => {
        if (!email || !password || !pseudo) {
            setError('Veuillez remplir tous les champs');
            setVisible(true);
            return;
        }

        const pseudoExists = await checkIfPseudoExists(pseudo);
        if (pseudoExists) {
            setError('Le pseudo existe déjà. Veuillez en choisir un autre');
            setVisible(true);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                email: user.email,
                pseudo: pseudo,
                experience: 0,
                goalExperience: 100,
                level: 1,
            });

            router.push('/'); // Redirige vers une page après l'inscription
        } catch (error: any) {
            const errorMessage = error.message; // Utilise `error.message` pour afficher un message d'erreur lisible
            setError(errorMessage);
            setVisible(true);
        }
    };

    return (
        <PaperProvider>
        <View style={styles.containerConexionInscription}>
            <Text style={styles.title}>Inscription</Text>
            <TextInput 
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input} 
                {...textInputStyles}
            />
            <TextInput 
                mode="outlined"
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input} 
                {...textInputStyles}
            />
            <TextInput 
                mode="outlined"
                label="Pseudo" 
                value={pseudo}
                onChangeText={setPseudo}
                style={styles.input} 
                {...textInputStyles}
            />
            <Button mode="contained" onPress={handleRegister} {...buttonStyle}>
                Inscription
            </Button>
            <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.textRegistration}>Déjà inscrit ?</Text>
            </TouchableOpacity>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={3000}
            >
                {error}
            </Snackbar>
            
        </View>
        </PaperProvider>
    );
};

export default Registration;
