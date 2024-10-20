import { Text, View, Button } from "react-native";
import { useRouter } from 'expo-router';

export default function home() {
  const router = useRouter();
  // router.replace('/login')
  return (
    <View>
      <Text>Welcome !</Text>
      <Button
            onPress={() => router.push('/login')}
            title="Learn More"
            color="#841584">
        </Button>
    </View>
    
  );
}