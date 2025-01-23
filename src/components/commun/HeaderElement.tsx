import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type HeaderElementProps = {
  title: string;
  onLogout: () => void;
};

const HeaderElement: React.FC<HeaderElementProps> = ({ title, onLogout }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
header: {
    backgroundColor: '#143b86',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
});

export default HeaderElement;
