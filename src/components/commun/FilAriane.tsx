import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type FilArianeProps = {
  ongletRetour: { url: string; label: string };
  ongletActuel: string;
  navigation: any;
};

const FilAriane: React.FC<FilArianeProps> = ({ ongletRetour, ongletActuel, navigation }) => {
  return (
    <View style={styles.filAriane}>
      <TouchableOpacity onPress={() => navigation.navigate(ongletRetour.url)}>
        <Text style={styles.link}>{ongletRetour.label}</Text>
      </TouchableOpacity>
      <Text style={styles.arrowNext}>&gt;</Text>
      <Text style={styles.ongletActuel}>{ongletActuel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    filAriane: {
    backgroundColor:'white',
      flexDirection: 'row',
      alignItems: 'center',
      width:'100%', 
      marginHorizontal: 'auto', 
      padding: 20, 
      color: '#143b86', 
    },
    link: {
      color: '#143b86',
      textDecorationLine: 'underline',
      paddingVertical: 10,
      paddingRight: 10,
      fontSize: 16,
    },
    arrowNext: {
      color: 'grey',
      fontWeight: 'bold',
      paddingRight: 10,
      fontSize: 16,
    },
    ongletActuel: {
      color: '#143b86',
      textDecorationLine: 'underline',
      fontSize: 16,
    },
  });
  
export default FilAriane;
