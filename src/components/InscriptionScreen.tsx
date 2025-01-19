import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { AuthentService } from '../services/AuthentService';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Inscription: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, 'Inscription'>;

const InscriptionScreen : React.FC<Props> =  ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [countryCode, setCountryCode] = useState('FR');
  const [callingCode, setCallingCode] = useState('33');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email:any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () =>{
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

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

    if (confirmPassword !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas.');
      isValid = false;
    }

    if (isValid) {
      const userData = {
        email,
        mdp: password,
        ...(telephone ? { telephone: `+${callingCode}${telephone}` } : {}),
        nom,
        prenom,
      };

      try {
        const authentService = new AuthentService();
        await authentService.registerUser(userData);
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Inscription réussie ! Vous pouvez vous connecter.',
        });
        navigation.navigate('Connexion');
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: err.message || 'Une erreur est survenue.',
        });
      }    
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={'padding'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Text style={styles.header}>Rejoignez Optimmo aujourd'hui</Text>
            <View style={styles.field}>
              <Text style={styles.label}>E-mail *</Text>
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
              <Text style={styles.label}>Mot de passe *</Text>
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
            <View style={styles.field}>
              <Text style={styles.label}>Confirmez le mot de passe *</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError('');
                }}
                secureTextEntry
              />
              {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={nom}
                onChangeText={setNom}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                value={prenom}
                onChangeText={setPrenom}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Téléphone</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CountryPicker
                  withFlag
                  withCallingCode
                  withFilter
                  countryCode={countryCode}
                  onSelect={(country) => {
                    setCountryCode(country.cca2);
                    setCallingCode(country.callingCode[0]);
                  }}
                />
                <Text style={styles.callingCode}>+{callingCode}</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={telephone}
                  onChangeText={setTelephone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                (!email || !password || !confirmPassword || password !== confirmPassword) && {
                  backgroundColor: 'gainsboro',
                },
              ]}
              onPress={handleRegister}
              disabled={!email || !password || !confirmPassword || password !== confirmPassword}
            >
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
              <Text style={styles.link}>Connectez-vous ?</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#143b86',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 100,
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
  callingCode: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
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

export default InscriptionScreen;
