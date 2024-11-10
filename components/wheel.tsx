// Wheel.tsx
import React, { useRef, useState } from 'react';
import { View, Text, Button, Animated, Easing, StyleSheet } from 'react-native';

const Wheel = () => {
  const sections = ['Prix 1', 'Prix 2', 'Prix 3', 'Prix 4', 'Prix 5', 'Prix 6'];
  const rotation = useRef(new Animated.Value(0)).current;
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const spinWheel = () => {
    const spinDuration = 3000;
    const randomSpins = Math.floor(Math.random() * 5) + 4;
    const endRotation = randomSpins * 360 + Math.floor(Math.random() * 360);

    Animated.timing(rotation, {
      toValue: endRotation,
      duration: spinDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      const normalizedRotation = endRotation % 360;
      const sectionIndex = Math.floor(normalizedRotation / (360 / sections.length));
      setSelectedSection(sections[sections.length - 1 - sectionIndex]);
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wheel,
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        {sections.map((section, index) => (
          <View
            key={index}
            style={[
              styles.section,
              { transform: [{ rotate: `${index * (360 / sections.length)}deg` }] },
            ]}
          >
            <Text style={styles.sectionText}>{section}</Text>
          </View>
        ))}
      </Animated.View>
      <Button title="Lancer la roue" onPress={spinWheel} />
      {selectedSection && <Text style={styles.resultText}>Résultat : {selectedSection}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wheel: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  resultText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Wheel;
