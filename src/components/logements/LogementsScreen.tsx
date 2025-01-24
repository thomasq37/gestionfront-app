import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity as GHTouchableOpacity, TapGestureHandler, State } from 'react-native-gesture-handler';
import { useAuth } from '../../auth/AuthContext';
import { LogementService } from '../../services/LogementService';
import { LogementDTO } from '../../models/entites/Logement/LogementDTO.model';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TypeDeLogement } from '../../models/enumeration/TypeDeLogement.enum';
import { LogBox } from 'react-native';
import AlerteElement from '../alerte/AlerteElement';
import PhotosCarousel from '../photo/PhotoCaroussel';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { PeriodeDeLocationDTO } from '../../models/entites/PeriodeDeLocation/PeriodeDeLocationDTO.model';
import HeaderElement from '../commun/HeaderElement';

LogBox.ignoreLogs(['Warning: Failed prop type: Carousel:']);

type NavigationProp = StackNavigationProp<RootStackParamList, 'Logements'>;

const LogementsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
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
  const dpeImages: { [key: string]: any } = {
    a: require('../../assets/img/energie-a-icon.png'),
    b: require('../../assets/img/energie-b-icon.png'),
    c: require('../../assets/img/energie-c-icon.png'),
    d: require('../../assets/img/energie-d-icon.png'),
    e: require('../../assets/img/energie-e-icon.png'),
    f: require('../../assets/img/energie-f-icon.png'),
    g: require('../../assets/img/energie-g-icon.png'),
  };

  const capitalize = (text: TypeDeLogement | undefined) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const renderLogementItem = ({ item }: { item: LogementDTO }) => {
    const dpeImage =
      item.caracteristiques?.dpeLettre && dpeImages[item.caracteristiques.dpeLettre.toLowerCase()]
        ? dpeImages[item.caracteristiques.dpeLettre.toLowerCase()]
        : null;
    const isNewLogement = !item.adresse || !item.caracteristiques;
    const sortedPhotos = item.photos
      ? [...item.photos].sort((a, b) => (b.isPrincipal ? 1 : 0) - (a.isPrincipal ? 1 : 0))
      : [];

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        navigation.navigate('Logement', { logement: item });
      }
    };
    const getTarifActuel = (periodesDeLocation: PeriodeDeLocationDTO[]): string => {
      const now = new Date();
      const periodeEnCours = periodesDeLocation.find(periode => {
        const debut = new Date(periode.dateDeDebut);
        const fin = periode.dateDeFin ? new Date(periode.dateDeFin) : null;
        return debut <= now && (!fin || now <= fin);
      });
      return periodeEnCours
        ? `${periodeEnCours.tarif.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`
        : 'Non loué';
    };
  
    return (
      <GestureHandlerRootView>
        <TapGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <GHTouchableOpacity
            activeOpacity={1}
            style={styles.logementItem}
          >
            {isNewLogement ? (
              <View style={styles.nouveauLogementContainer}>
                <Image
                  source={require('../../assets/img/no-image.jpg')}
                  style={styles.defaultImage}
                />
                <View style={styles.headerLogementInfos}>
                  <Text style={styles.typeLogementNouveau}>Nouveau logement</Text>
                </View>
              </View>
            ) : (
              <>
                {/* Carrousel */}
                <View pointerEvents="box-none">
                  {sortedPhotos.length > 0 ? (
                    <PhotosCarousel photos={sortedPhotos} />
                  ) : (
                    <Image
                      source={require('../../assets/img/no-image.jpg')}
                      style={styles.defaultImage}
                    />
                  )}
                </View>

                {/* Informations principales */}
                <View style={styles.headerLogement}>
                  <Text style={styles.typeLogement}>
                    {capitalize(item.caracteristiques?.typeDeLogement) || 'Type inconnu'}
                  </Text>
                  <Text style={styles.prixLoyer}>
                    {getTarifActuel(item.periodesDeLocation)}
                  </Text>
                </View>
                <Text style={styles.ville}>{item.adresse?.ville || 'Ville inconnue'}</Text>
                <Text style={styles.details}>
                  {item.caracteristiques?.nombreDePieces} pièces • {item.caracteristiques?.surfaceLogement} m²{' '}
                  {item.caracteristiques?.meubleeOuNon ? '• Meublé' : ''}{' '}
                  {item.caracteristiques?.parkingOuNon ? '• Parking' : ''}
                </Text>

                {/* Affichage du DPE */}
                {dpeImage && (
                  <Image
                    source={dpeImage}
                    style={styles.dpeImage}
                    alt="Icône de la classe énergie"
                  />
                )}

                {/* Affichage des alertes */}
                {item.alertes && item.alertes.length > 0 && (
                  <AlerteElement alertes={item.alertes} ouvrable={false} />
                )}
              </>
            )}
          </GHTouchableOpacity>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderElement title="Vue d'ensemble" onLogout={logout} />
      
        <View style={styles.content}>
          {isLoading ? (
          <View style={styles.centeredContainer}>
            <Image
              source={require('../../assets/img/loader.gif')} // Remplacez par le chemin de votre GIF
              style={styles.gif}
            />
          </View>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : logements.length > 0 ? (
            <>
            <Text style={styles.textDescripion}>Retrouvez ici l'ensemble de vos logements et les informations principales</Text>
            <FlatList
              data={logements}
              renderItem={renderLogementItem}
              keyExtractor={(item) => item.masqueId || Math.random().toString()}
              ListFooterComponent={
                !isLoading && !error ? (
                  <TouchableOpacity style={styles.addButton} onPress={handleCreateLogement}>
                    <Text style={styles.addButtonText}>Ajouter un logement</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
            </>
            
          ) : (
            <Text style={styles.noLogements}>Aucun logement trouvé.</Text>
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif:{
    width:100,
    height:100
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f8',
  },
  
  content: {
    flex: 1,
    marginTop:15


  },
  textDescripion: {
    marginHorizontal:20,
    marginVertical:10,
    fontSize:13,
    fontWeight: 'bold',
    color: 'grey'
  },
  logementItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal:20,
    marginVertical:10,
    paddingBottom:20
  
  },
  nouveauLogementContainer: {
    borderRadius: 8,
    marginBottom: 20,
  },
  defaultImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerLogementInfos: {
    marginTop: 15,
  },
  typeLogementNouveau: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143b86',
    paddingLeft: 20
  },
  headerLogement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
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
  },
  ville: {
    fontSize: 15,
    color: '#676767',
    textTransform: 'uppercase',
    marginVertical: 8,
    paddingLeft: 20,
    paddingRight: 20
  },

  details: {
    fontSize: 15,
    color: '#676767',
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingRight: 20,
  },
  dpeImage: {
    width: 120,
    height: 29,
    resizeMode: 'contain',
    marginHorizontal: 20,
    marginVertical: 10
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
    margin:20

  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogementsScreen;
