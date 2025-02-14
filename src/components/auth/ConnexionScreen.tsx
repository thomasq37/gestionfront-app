import React, { useState } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthentService } from '../../services/AuthentService';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../auth/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  Connexion: undefined;
  Inscription:undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, 'Connexion'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'Connexion'>;
const ConnexionScreen : React.FC<Props> = () => {
  const { login } = useAuth();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const validateEmail = (email:any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () =>{
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email) {
      setEmailError("L'adresse e-mail est obligatoire.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse e-mail valide.");
      isValid = false;
    }

    if (!password) {
      setPasswordError('Le mot de passe est obligatoire.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
      isValid = false;
    } else if (!/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Le mot de passe doit contenir au moins un chiffre et un caractère spécial.');
      isValid = false;
    }

    if (isValid) {
      const userData = {
              email,
              mdp: password
            };
      
            try {
              const authentService = new AuthentService();
              const token = await authentService.authenticateUser(userData);
              login(token.message); 
            } catch (err:any) {
              console
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: err.message || 'Une erreur est survenue.',
              });
            }    
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
        <View style={styles.form}>
          <Text style={styles.header}>Se connecter à Optimmo</Text>
          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
            />
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              (!email || !validateEmail(email) || !password) && { backgroundColor: 'gainsboro' },
            ]}
            onPress={handleLogin}
            disabled={!email || !validateEmail(email) || !password} 
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
            <Text style={styles.link}>Pas de compte ? Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
                </View>
              </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  form: {
    backgroundColor: 'white',
    padding: 20
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#143b86',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#143b86',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#143b86',
    padding: 15,
  },
});

export default ConnexionScreen;
