import React from 'react';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ConnexionScreen from './src/components/auth/ConnexionScreen';
import InscriptionScreen from './src/components/auth/InscriptionScreen';
import LogementsScreen from './src/components/logements/LogementsScreen';
import LogementScreen from './src/components/logements/LogementScreen';

import Toast from 'react-native-toast-message';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
            <Stack.Screen
          name="Logements"
          component={LogementsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Logement"
          component={LogementScreen}
          options={{ title: 'Détails du logement' }}
        />
        </>

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
