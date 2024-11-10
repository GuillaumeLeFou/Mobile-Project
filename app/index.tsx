import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { TextInput, Button, Text, Snackbar, PaperProvider } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '@/constants/firebase';
import { useRouter } from 'expo-router';
import { useDynamicStyles } from '@/constants/Styles';
import { useDynamicStylesComponents } from '@/constants/componentsStyles';



const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);
    const { textInputStyles, buttonStyle } = useDynamicStylesComponents();
    const styles = useDynamicStyles();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setError('');
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/home');
        } catch (err) {
            setError('Échec de la connexion. Vérifiez vos identifiants.');
            setVisible(true);
        }
    };

    const onDismissSnackBar = () => setVisible(false);

    return (
      <PaperProvider>
        <View style={styles.containerConexionInscription}>
            <Text style={styles.title}>Connexion</Text>
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
            <Button
                mode="contained"
                onPress={handleLogin}
                {...buttonStyle} >
                Se connecter
            </Button>
            <TouchableOpacity onPress={() => router.push('/registration')}>
                <Text style={styles.textRegistration}>Pas encore de compte ?</Text>
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

export default LoginScreen;
