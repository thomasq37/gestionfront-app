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
            source={require('../../assets/img/danger-icon.png')}
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
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#007BFF',
  },
  adresseContenu: {
    marginTop: 16,
  },
  adresseField: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#333',
  },
  fieldValue: {
    color: '#666',
  },
});

export default AdresseElement;
