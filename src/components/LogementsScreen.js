import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogementsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue sur l'écran Logements</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f8',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#143b86',
  },
});

export default LogementsScreen;
