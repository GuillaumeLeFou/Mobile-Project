import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextInput, Button, Text, Snackbar, PaperProvider } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '@/constants/firebase';
import { useRouter } from 'expo-router';
import { Styles } from '@/constants/Styles';
import { textInputStyles, buttonStyle } from '@/constants/componentsStyles';



const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [visible, setVisible] = useState(false);

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
        <View style={Styles.containerConexionInscription}>
            <Text style={Styles.title}>Connexion</Text>
            <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={Styles.input}
                {...textInputStyles}
            />
            <TextInput
                mode="outlined"
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={Styles.input}
                {...textInputStyles}
            />
            <Button
                mode="contained"
                onPress={handleLogin}
                {...buttonStyle} >
                Se connecter
            </Button>
            <TouchableOpacity onPress={() => router.push('/registration')}>
                <Text style={Styles.textRegistration}>Pas encore de compte ?</Text>
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
