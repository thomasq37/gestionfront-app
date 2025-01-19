import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { LogementService } from '../services/LogementService';
import { LogementDTO } from '../models/entites/Logement/LogementDTO.model';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TypeDeLogement } from '../models/enumeration/TypeDeLogement.enum';
import Carousel from 'react-native-snap-carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';
const LogementsScreen = () => {
  const { logout } = useAuth();
  const [logements, setLogements] = useState<LogementDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listerLogements = async () => {
      try {
        const logementService = new LogementService();
        const data = await logementService.listerLogements();
        setLogements(data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue.');
      } finally {
        setIsLoading(false);
      }
    };

    listerLogements();
  }, []);

  const handleCreateLogement = () => {
    Alert.alert('Création', 'Fonctionnalité à implémenter.');
  };

  const renderCarouselItem = ({ item }: { item: { image: string } }) => (
    <View style={styles.carouselItemContainer}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        style={styles.carouselImage}
      />
    </View>
  );

  const renderLogementItem = ({ item }: { item: LogementDTO }) => (
    <View style={styles.logementItem}>
      {Array.isArray(item.photos) && item.photos.length > 0 ? (
      <View style={styles.carouselContainer}>
        <Carousel
            data={item.photos}
            renderItem={renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width}
            loop={true}
            enableSnap={true}
            containerCustomStyle={undefined}
            inactiveSlideOpacity={0.4}
            inactiveSlideScale={0.6}
        />
      </View>
    ) : (
      <Text style={styles.noPhotos}>Aucune photo disponible</Text>
    )}
    

      <View style={styles.headerLogement}>
        <Text style={styles.typeLogement}>
          {capitalize(item.caracteristiques?.typeDeLogement) || 'Type inconnu'}
        </Text>
        <Text style={styles.prixLoyer}>
          {item.periodesDeLocation?.length ? `${item.periodesDeLocation[0].tarif} €` : 'Non loué'}
        </Text>
      </View>
      <Text style={styles.ville}>{item.adresse?.ville || 'Ville inconnue'}</Text>
      <Text style={styles.details}>
        {item.caracteristiques?.nombreDePieces} pièces • {item.caracteristiques?.surfaceLogement} m²{' '}
        {item.caracteristiques?.meubleeOuNon ? '• Meublé' : ''}{' '}
        {item.caracteristiques?.parkingOuNon ? '• Parking' : ''}
      </Text>
    </View>
  );
  const capitalize = (text: TypeDeLogement | undefined) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Vue d'ensemble</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#143b86" />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : logements.length > 0 ? (
            <FlatList
              data={logements}
              renderItem={renderLogementItem}
              keyExtractor={(item) => item.masqueId || Math.random().toString()}
            />
          ) : (
            <Text style={styles.noLogements}>Aucun logement trouvé.</Text>
          )}
          {!isLoading && !error && (
            <TouchableOpacity style={styles.addButton} onPress={handleCreateLogement}>
              <Text style={styles.addButtonText}>Ajouter un logement</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#143b86',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  header: {
    backgroundColor: '#143b86',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 15,
  },
  logementItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carouselContainer: {
    width: '100%', 
    height: 250,
    marginBottom: 15,
  },
   carouselItemContainer: {
    width: Dimensions.get('window').width - 10,
    height: 300,
    borderTopLeftRadius: 8, // Ajoute un arrondi en haut à gauche
    borderTopRightRadius: 8,

  },
  
  carouselImage: {
    width: '95%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8, // Ajoute un arrondi en haut à gauche
    borderTopRightRadius: 8,

  },
  noPhotos: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  headerLogement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingLeft: 20,
    paddingRight:20
  },
  typeLogement: {
    fontSize: 18,
    color: '#143b86',
    fontWeight: 'bold',
  },
  prixLoyer: {
    fontSize: 20,
    color: '#0eb7fc',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  ville: {
    fontSize: 16,
    color: '#676767',
    textTransform: 'uppercase',
    marginBottom: 5,
    paddingLeft: 20,
    paddingRight:20
  },
  details: {
    fontSize: 15,
    color: '#676767',
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingRight:20,
    paddingBottom:20
  },
  error: {
    color: '#ff4d4d',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  noLogements: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#1c5eeb',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogementsScreen;
