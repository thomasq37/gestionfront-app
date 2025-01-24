import React, {useMemo} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CaracteristiquesDTO } from '../../models/entites/Caracteristiques/CaracteristiquesDTO.model';

type CaracteristiquesProps = {
  caracteristiques: CaracteristiquesDTO | null;
};

const CaracteristiquesElement: React.FC<CaracteristiquesProps> = ({
  caracteristiques,
}) => {
    const dpeImages: { [key: string]: any } = {
        a: require('../../assets/img/energie-a-icon.png'),
        b: require('../../assets/img/energie-b-icon.png'),
        c: require('../../assets/img/energie-c-icon.png'),
        d: require('../../assets/img/energie-d-icon.png'),
        e: require('../../assets/img/energie-e-icon.png'),
        f: require('../../assets/img/energie-f-icon.png'),
        g: require('../../assets/img/energie-g-icon.png'),
      };

      const dpeImage = useMemo(() => 
        caracteristiques?.dpeLettre && dpeImages[caracteristiques.dpeLettre.toLowerCase()]
          ? dpeImages[caracteristiques.dpeLettre.toLowerCase()]
          : null, 
        [caracteristiques, dpeImages]
      );
  return (
    <View style={styles.caracteristiquesElement}>
      <View style={styles.customCard}>
        <View style={styles.customCardHeader}>
          <Text style={styles.headerTitle}>
            {caracteristiques ? 'Caractéristiques' : 'Caractéristiques à renseigner'}
          </Text>
          <TouchableOpacity>
            <Image
              source={require('../../assets/img/edit-icon.png')} // Remplacez par le chemin de votre icône
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        {caracteristiques && (
          <View style={styles.caracteristiquesContenu}>
            {/* Type de logement */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/adresse-icon.jpg')}
              label="Type de logement:"
              value={caracteristiques.typeDeLogement || 'Non renseigné'}
            />

            {/* Date d'achat */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/calendar.png')}
              label="Date d'achat:"
              value={caracteristiques.dateAchat || 'Non renseigné'}
            />

            {/* Nombre de pièces */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/nb-pieces-icon.png')}
              label="Nombre de pièces:"
              value={caracteristiques.nombreDePieces?.toString() || 'Non renseigné'}
            />

            {/* Meublée ou non */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/meuble-icon.png')}
              label="Meublé:"
              value={caracteristiques.meubleeOuNon ? 'Oui' : 'Non'}
            />

            {/* Surface intérieure */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/surface-icon.png')}
              label="Surface:"
              value={caracteristiques.surfaceLogement ? `${caracteristiques.surfaceLogement} m²` : 'Non renseigné'}
            />

            {/* Extérieur */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/balcon-icon.png')}
              label="Extérieur:"
              value={caracteristiques.balconOuTerrasse ? 'Oui' : 'Non'}
            />

            {/* Surface extérieure */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/surface-icon.png')}
              label="Surface extérieur:"
              value={
                caracteristiques.surfaceBalconOuTerrasse
                  ? `${caracteristiques.surfaceBalconOuTerrasse} m²`
                  : 'Non renseigné'
              }
            />

            {/* Parking */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/parking-icon.png')}
              label="Parking:"
              value={caracteristiques.parkingOuNon ? 'Oui' : 'Non'}
            />

            {/* Prix d'achat */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/euro-icon.png')}
              label="Prix net vendeur:"
              value={
                caracteristiques.montantAchat !== null
                  ? `${caracteristiques.montantAchat.toFixed(2)} €`
                  : 'Non renseigné'
              }
            />

            {/* Frais d'acquisition */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/notary-icon.png')}
              label="Frais d'acquisition:"
              value={
                caracteristiques.montantFraisDeNotaireEtNegociation !== null
                  ? `${caracteristiques.montantFraisDeNotaireEtNegociation?.toFixed(2)} €`
                  : 'Non renseigné'
              }
            />

            {/* Estimation net vendeur */}
            <DetailItem
              icon={require('../../assets/img/caracteristiques-icones/estimate-icon.png')}
              label="Estimation net vendeur:"
              value={
                caracteristiques.montantEstimation && caracteristiques.montantEstimation > 0
                  ? `${caracteristiques.montantEstimation.toFixed(2)} €`
                  : 'A réaliser'
              }
            />

            {/* Classe énergie */}
            <View style={[styles.detailItem, styles.energie]}>
              <Image
                source={require('../../assets/img/caracteristiques-icones/energie-icon.png')}
                style={styles.iconeCategorie}
              />
              <View>
                <Text style={styles.fieldLabel}>Classe énergie:</Text>
                {caracteristiques.dpeLettre ? (
                  <Image
                    source={dpeImage}
                    style={styles.energyIcon}
                  />
                ) : (
                  <Text style={styles.fieldValue}>Non renseigné</Text>
                )}
              </View>
            </View>

            {/* Fichier classe énergie */}
            {caracteristiques.dpeFichier ? (
              <TouchableOpacity
                style={styles.btnEditerBasique}
              >
                <Text style={styles.btnEditerText}>Télécharger le DPE</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noDPEText}>Aucun fichier DPE</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const DetailItem = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Image source={icon} style={styles.iconeCategorie} />
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  caracteristiquesElement: {
    marginTop: 16,
  },
  customCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#d1d1d1',
  },
  customCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#143b86',
  },
  editIcon: {
    width: 30,
    height: 30,
    padding:5,
    tintColor: '#143b86',
    borderColor: '#d1d1d1',
    borderWidth: 1, // Ajoute une bordure
    borderRadius: '50%', // 50% de width/height pour un cercle parfait
  },
  
  caracteristiquesContenu: {
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  iconeCategorie: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f1f5',
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#143b86',
    marginBottom: 4,
  },
  fieldValue: {
    color: '#666',
  },
  energie: {
    flexDirection: 'row',
  },
  energyIcon: {
    width: 80,
        height: 15,
  },
  btnEditerBasique: {
    marginTop: 16,
  },
  btnEditerText: {
    color: '#143b86',
    textDecorationLine: 'underline',
  },
  noDPEText: {
    marginTop: 16,
    color: '#666',
  },
});

export default CaracteristiquesElement;
