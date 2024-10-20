import { Button, Text, View } from "react-native";
import { useRouter } from 'expo-router';

export default function home() {
  const router = useRouter();
  return (
    <View>
        <Text>Welcome !</Text>
    </View>
    
  );
}