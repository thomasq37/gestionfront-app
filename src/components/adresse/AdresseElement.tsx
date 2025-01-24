import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LogementDTO } from '../../models/entites/Logement/LogementDTO.model';

type AdresseElementProps = {
  adresse: LogementDTO['adresse'];
};

const AdresseElement: React.FC<AdresseElementProps> = ({ adresse }) => {
  return (
    <View style={styles.adresseElement}>
      <View style={styles.customCard}>
        <View style={styles.customCardHeader}>
          <Text style={styles.headerTitle}>
            {adresse ? 'Adresse' : 'Adresse à renseigner'}
          </Text>
          <Image
            source={require('../../assets/img/edit-icon.png')}
            style={styles.editIcon}
          />
        </View>
        {adresse && (
          <View style={styles.adresseContenu}>
            <View style={styles.adresseField}>
              <Text style={styles.fieldLabel}>Numéro:</Text>
              <Text style={styles.fieldValue}>{adresse.numero}</Text>
            </View>
            <View style={styles.adresseField}>
              <Text style={styles.fieldLabel}>Voie:</Text>
              <Text style={styles.fieldValue}>{adresse.voie}</Text>
            </View>
            <View style={styles.adresseField}>
              <Text style={styles.fieldLabel}>Complément adresse:</Text>
              <Text style={styles.fieldValue}>{adresse.complementAdresse || 'N/A'}</Text>
            </View>
            <View style={styles.adresseField}>
              <Text style={styles.fieldLabel}>Code postal:</Text>
              <Text style={styles.fieldValue}>{adresse.codePostal}</Text>
            </View>
            <View style={styles.adresseField}>
              <Text style={styles.fieldLabel}>Pays:</Text>
              <Text style={styles.fieldValue}>{adresse.pays}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adresseElement: {
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
    borderColor: '#d1d1d1'
  },
  customCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,

    borderBottomWidth: 1, // Ajoute une bordure

    borderBottomColor: '#d1d1d1'
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
  
  adresseContenu: {
    margin: 10,
  },
  adresseField: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#143b86',
  },
  fieldValue: {
    color: '#666',
  },
});

export default AdresseElement;
