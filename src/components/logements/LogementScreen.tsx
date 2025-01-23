import React, {useCallback, useMemo, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, SafeAreaView 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../auth/AuthContext';
import HeaderElement from '../commun/HeaderElement';
import FilAriane from '../commun/FilAriane';
import AlerteElement from '../alerte/AlerteElement';
import PhotosCarousel from '../photo/PhotoCaroussel';
import { TypeDeLogement } from '../../models/enumeration/TypeDeLogement.enum';
import { PeriodeDeLocationDTO } from '../../models/entites/PeriodeDeLocation/PeriodeDeLocationDTO.model';
import { CaracteristiquesDTO } from '../../models/entites/Caracteristiques/CaracteristiquesDTO.model';
import NavLogement from './NavLogement';
import { ScrollView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';


type LogementScreenRouteProp = RouteProp<RootStackParamList, 'Logement'>;
type LogementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Logement'>;

type Props = {
  route: LogementScreenRouteProp;
  navigation: LogementScreenNavigationProp;
};

const LogementScreen: React.FC<Props> = ({ route, navigation }) => {
  const { logement } = route.params;
  const { logout } = useAuth();
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])

  const dpeImages: { [key: string]: any } = useMemo(() => ({
    a: require('../../assets/img/energie-a-icon.png'),
    b: require('../../assets/img/energie-b-icon.png'),
    c: require('../../assets/img/energie-c-icon.png'),
    d: require('../../assets/img/energie-d-icon.png'),
    e: require('../../assets/img/energie-e-icon.png'),
    f: require('../../assets/img/energie-f-icon.png'),
    g: require('../../assets/img/energie-g-icon.png'),
  }), []);

  const capitalize = useCallback((text: TypeDeLogement | undefined) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }, []);


  const menuItems = useMemo(() => [
    'Statistiques', 'Adresse', 'Caractéristiques', 
    'Frais', 'Périodes de location', 'Locataires', 
    'Contacts', 'Alertes', 'Documents', 'Supprimer'
  ], []);

  const sortedPhotos = useMemo(() => 
    logement.photos
      ? [...logement.photos].sort((a, b) => (b.isPrincipal ? 1 : 0) - (a.isPrincipal ? 1 : 0))
      : [], 
    [logement.photos]
  );

  const dpeImage = useMemo(() => 
    logement.caracteristiques?.dpeLettre && dpeImages[logement.caracteristiques.dpeLettre.toLowerCase()]
      ? dpeImages[logement.caracteristiques.dpeLettre.toLowerCase()]
      : null, 
    [logement.caracteristiques, dpeImages]
  );

  const getTarifActuel = useCallback((periodesDeLocation: PeriodeDeLocationDTO[]) => {
    const now = new Date();
    const periodeEnCours = periodesDeLocation?.find((periode) => {
      const debut = new Date(periode.dateDeDebut);
      const fin = periode.dateDeFin ? new Date(periode.dateDeFin) : null;
      return debut <= now && (!fin || now <= fin);
    });

    if (!periodeEnCours) return 'Non loué';

    const tarif = periodeEnCours.tarif.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });

    const frequence =
      periodeEnCours.typeDeLocation === 'MENSUELLE'
        ? '/mois'
        : periodeEnCours.typeDeLocation === 'JOURNALIERE'
          ? '/jour'
          : '';

    return `${tarif} ${frequence}`;
  }, []);

  const getBalconOuTerrasse = useCallback((caracteristiques: CaracteristiquesDTO) => {
    if (caracteristiques?.balconOuTerrasse) {
      return caracteristiques.typeDeLogement === 'APPARTEMENT' ? 'Balcon(s)' : 'Terrasse(s)';
    }
    return '';
  }, []);

  const LogementDetails = useCallback(() => {

    if (!logement?.adresse || !logement?.caracteristiques) return null;

    return (
      <View style={styles.logementInfos}>
        <Text style={styles.title}>
          {capitalize(logement.caracteristiques.typeDeLogement) + ' '}
          {logement.adresse.numero} {logement.adresse.voie}
        </Text>

        <Text style={styles.prixLoyerActuel}>
          {getTarifActuel(logement.periodesDeLocation)}
        </Text>

        <View style={styles.detailsLogement}>
          <Text style={styles.detail}>
            {logement.caracteristiques.nombreDePieces} pièces
          </Text>
          <Text style={styles.detail}>
            {logement.caracteristiques.surfaceLogement} m²
          </Text>
          <Text style={styles.detail}>
            {logement.caracteristiques.meubleeOuNon ? 'Meublé' : 'Non meublé'}
          </Text>
          {logement.caracteristiques.parkingOuNon && <Text style={styles.detail}>Parking</Text>}
          {logement.caracteristiques.balconOuTerrasse && (
            <Text style={styles.detail}>{getBalconOuTerrasse(logement.caracteristiques)}</Text>
          )}
        </View>

        {logement.caracteristiques.dpeLettre && (
          <Image
            source={dpeImage}
            style={styles.dpeImage}
            alt="Icône de la classe énergie"
          />
        )}

        <AlerteElement alertes={logement.alertes} ouvrable={true} />
        <NavLogement
            logement={logement}
            menuItems={menuItems}></NavLogement>
            
      </View>
    );
  }, [
    logement, 
    capitalize, 
    getTarifActuel, 
    getBalconOuTerrasse, 
    dpeImage
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderElement title="Synthèse logement" onLogout={logout} />
    
        <ScrollView>
        <FilAriane
        ongletRetour={{ url: 'Logements', label: "Vue d'ensemble" }}
        ongletActuel="Synthèse logement"
        navigation={navigation}
      />
        <View style={styles.container}>
        {sortedPhotos.length > 0 ? (
          <PhotosCarousel photos={sortedPhotos} variant="logement" />
        ) : (
          <Image
            source={require('../../assets/img/no-image.jpg')}
            style={styles.defaultImage}
          />
        )}

        <LogementDetails />
      </View>
        </ScrollView>
   
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
        backgroundColor: '#fff',
    },
    contentContainer: {
        marginTop: 16,
    },
    deleteButton: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'red',
        borderRadius: 8,
    },
    logementInfos: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    title: {
        fontSize: 19,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: 15,
        color: '#143b86'
    },
    prixLoyerActuel: {
        color: '#0eb7fc',
        fontWeight: 'bold',
        fontSize: 19,
        paddingHorizontal: 15,
        marginBottom: 15
    },
    detailsLogement: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
        paddingHorizontal: 16,

    },
    detail: {
        backgroundColor: '#1c5eeb',
        color: 'white',
        fontWeight: '500',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 15,

    },
    dpeLogement: {
        width: 70,
        height: 70,
    },
    defaultImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
        marginBottom: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    dpeImage: {
        width: 115,
        height: 27,
        resizeMode: 'contain',
        marginHorizontal: 15,
        marginBottom: 15
    },




    navLogement: {
        marginTop: 16,
        marginHorizontal: 15,
      },
      scrollContainer: {
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#d0d0d0',
        marginBottom: 24,
      },
      navItem: {
        paddingBottom: 16,
        marginRight: 16,
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
      },
      activeNavItem: {
        borderBottomColor: '#1c5eeb',
      },
      lastNavItem: {},
      activeLastNavItem: {
        borderBottomColor: 'red',
      },
      navItemText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#143b86',
      },
      lastNavItemText: {
        color: 'red',
      },
});

export default LogementScreen;
