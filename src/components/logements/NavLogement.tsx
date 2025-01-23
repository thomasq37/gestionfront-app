import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LogementDTO } from '../../models/entites/Logement/LogementDTO.model';
import AdresseElement from '../adresse/AdresseElement';

type NavLogementProps = {
  menuItems: string[];
  logement: LogementDTO;
};


const NavLogement: React.FC<NavLogementProps> = ({ menuItems, logement }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePress = (index: number) => {
    setActiveIndex(index);
  };

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>
              Contenu pour le {logement.adresse?.codePostal} élément du menu
            </Text>
          </View>
        );
        case 1:
          return <AdresseElement adresse={logement.adresse} />;
      
      default:
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Contenu par défaut</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation des éléments */}
      <View style={styles.navLogement}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(index)}
              style={[
                styles.navItem,
                index === activeIndex && styles.activeNavItem,
                index === menuItems.length - 1 && styles.lastNavItem,
                index === activeIndex && index === menuItems.length - 1 && styles.activeLastNavItem,
              ]}
            >
              <Text
                style={[
                  styles.navItemText,
                  index === menuItems.length - 1 && styles.lastNavItemText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Affichage du contenu en fonction de l'index actif */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  navLogement: {
    marginTop: 16,
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
  content: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
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

export default NavLogement;
