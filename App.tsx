import React from 'react';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ConnexionScreen from './src/components/ConnexionScreen';
import InscriptionScreen from './src/components/InscriptionScreen';
import LogementsScreen from './src/components/LogementsScreen';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Logements" component={LogementsScreen} />
      ) : (
        <>
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => (
  <AuthProvider>
    <NavigationContainer>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  </AuthProvider>
);

export default App;
