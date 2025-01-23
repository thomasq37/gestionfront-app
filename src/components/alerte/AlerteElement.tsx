import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const AlerteElement = ({ alertes, ouvrable = false }: { alertes: any[]; ouvrable: boolean }) => {
  const [alertesIsOpen, setAlertesIsOpen] = useState(false);

  const toggleAlertesIsOpen = () => {
    setAlertesIsOpen(!alertesIsOpen);
  };

  const renderAlerte = ({ item }: { item: { probleme: string; solution: string } }) => (
    <View style={styles.alerteItem}>
      <Text style={styles.alerteCat}>
        Problème: <Text style={styles.span}>{item.probleme}</Text>
      </Text>
      <Text style={styles.alerteCat}>
        Solution: <Text style={styles.span}>{item.solution}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {alertes.length > 0 && (
        <TouchableOpacity 
            disabled={!ouvrable} 
            onPress={toggleAlertesIsOpen} 
            style={styles.alertesContainer}>
          <View style={styles.alertesContent}>
            <Image source={require('../../assets/img/danger-icon.png')} style={styles.dangerIcon} />
            <Text style={styles.alertesText}>{alertes.length} alerte(s)</Text>
          </View>
          {ouvrable && (
            <Image
              source={
                alertesIsOpen
                  ? require('../../assets/img/fermer-icon.png')
                  : require('../../assets/img/fleche-bas-icon.png')
              }
              style={styles.flecheIcon}
            />
          )}
        </TouchableOpacity>
      )}

      {alertesIsOpen && (
        <FlatList
          data={alertes}
          renderItem={renderAlerte}
          keyExtractor={(item, index) => index.toString()}
          style={styles.alertesList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
  },
  alertesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f3d6',
    padding: 10,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ebe5be',
    marginHorizontal:15,
  },
  alertesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertesText: {
    color: '#91692a',
    fontSize: 14,
  },
  dangerIcon: {
    width: 18,
    height: 16,
  },
  flecheIcon: {
    width: 18,
    height: 16,
  },
  alertesList: {
    flexDirection: 'column',
    gap: 10,
    marginHorizontal:15
  },
  alerteItem: {
    backgroundColor: '#f8f3d6',
    padding: 10,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ebe5be',
    marginBottom:10
    
  },
  alerteCat:{
    color: '#91692a',
    fontSize: 13,
    fontWeight: 'bold',
  },
  span: {
    fontWeight: 'normal',
  },
});

export default AlerteElement;
