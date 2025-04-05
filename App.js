import React, { useRef, useState } from 'react';
import { View, Text, Button, Animated, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [isCooldown, setIsCooldown] = useState(false); // Track cooldown state
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const meltAnim = useRef(new Animated.Value(0)).current;

  const playShakeSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: 'https://drive.google.com/uc?export=download&id=15Z5rzMiXXxcScozfBA0Smpicg8sfLww-', // Your sound link
      });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const startShake = () => {
    if (isCooldown) return; // If on cooldown, do nothing

    setIsCooldown(true); // Start cooldown

    // Play sound
    playShakeSound();

    // Start shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    // Set cooldown for 3 seconds
    setTimeout(() => {
      setIsCooldown(false); // Reset cooldown after 3 seconds
    }, 3000);
  };

  const startMelt = () => {
    if (isCooldown) return; // If on cooldown, do nothing

    setIsCooldown(true); // Start cooldown

    meltAnim.setValue(0);
    Animated.timing(meltAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(meltAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    // Set cooldown for 3 seconds
    setTimeout(() => {
      setIsCooldown(false); // Reset cooldown after 3 seconds
    }, 3000);
  };

  const meltTranslate = meltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const meltScaleY = meltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const meltRotate = meltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          {
            transform: [
              { translateX: shakeAnim },
              { translateY: meltTranslate },
              { scaleY: meltScaleY },
              { rotateZ: meltRotate },
            ],
          },
        ]}
      >
        <Text style={styles.text}>I'm Reacting!</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Button title="Shake" onPress={startShake} disabled={isCooldown} />
        <View style={{ height: 10 }} />
        <Button title="Melt" onPress={startMelt} disabled={isCooldown} />
      </View>

      {isCooldown && <Text style={styles.cooldownText}>Please wait...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#8E44AD',
    padding: 40,
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    width: '60%',
  },
  cooldownText: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
});
