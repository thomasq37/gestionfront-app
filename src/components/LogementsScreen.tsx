import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { LogementService } from '../services/LogementService';
import { LogementDTO } from '../models/entites/Logement/LogementDTO.model';
const LogementsScreen = () => {
  const { logout } = useAuth();  
  const [logements, setLogements] = useState<LogementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogements = async () => {
      try {
        const logementService = new LogementService();
        const data = await logementService.listerLogements();
        setLogements(data);
      } catch (error : any) {
        Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogements();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const renderLogementItem = ({ item }: { item: LogementDTO }) => (
    <View style={styles.logementItem}>
      <Text style={styles.logementText}>
        Adresse : {item.adresse?.voie} {item.adresse?.numero || ''} {item.adresse?.complementAdresse || ''}
      </Text>
      <Text style={styles.logementText}>
        Ville : {item.adresse?.ville}, {item.adresse?.codePostal}, {item.adresse?.pays}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vue d'ensemble</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        {isLoading ? (
          <Text style={styles.text}>Chargement des logements...</Text>
        ) : logements.length > 0 ? (
          <FlatList
            data={logements}
            renderItem={renderLogementItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.text}>Aucun logement trouvé.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  header: {
    backgroundColor: '#143b86',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 80,
    paddingBottom: 30,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#143b86',
    textAlign: 'center',
  },
  logementItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logementText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default LogementsScreen;
