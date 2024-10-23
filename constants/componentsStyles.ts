import { Colors } from './Colors';
import { useColorScheme } from 'react-native';

// Fonction pour déterminer les styles dynamiques selon le thème du téléphone
export const useDynamicStylesComponents = () => {
    const theme = useColorScheme(); // 'light' ou 'dark'

    return {
        textInputStyles: {
            outlineColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
            activeOutlineColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
            placeholderTextColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
            textColor: theme === 'dark' ? Colors.dark.text : Colors.light.text,
        },
        buttonStyle: {
            buttonColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
            textColor: theme === 'dark' ? Colors.dark.text : Colors.light.textButton,
        },
    };
};
