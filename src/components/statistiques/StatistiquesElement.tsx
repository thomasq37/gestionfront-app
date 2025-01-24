import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogementDTO } from '../../models/entites/Logement/LogementDTO.model';
import { FraisDTO } from '../../models/entites/Frais/FraisDTO.model';
import { PeriodeDeLocationDTO } from '../../models/entites/PeriodeDeLocation/PeriodeDeLocationDTO.model';
import { Frequence } from '../../models/enumeration/Frequence.enum';
import { TypeDeLocation } from '../../models/enumeration/TypeDeLocation.enum';

// Remplacez ces imports par vos propres modèles ou données.

const StatistiquesElement = ({ logement }: { logement: LogementDTO }) => {
    const [totalRevenus, setTotalRevenus] = useState(0);
    const [totalDepenses, setTotalDepenses] = useState(0);
    const [tauxOccupation, setTauxOccupation] = useState(0);

    useEffect(() => {
        const dateActuelle = new Date();
        calculerTotalRevenus(dateActuelle);
        calculerTotalDepenses(dateActuelle);
        calculerTauxOccupation(dateActuelle);
    }, [logement]);

    const calculerTotalRevenus = (dateActuelle: Date) => {
        let total = 0;
        logement.periodesDeLocation.forEach((periode) => {
            const dateDebut = new Date(periode.dateDeDebut);
            const dateFin = periode.dateDeFin ? new Date(periode.dateDeFin) : dateActuelle;

            const revenu = calculerRevenuParPeriode(
                periode.tarif,
                periode.typeDeLocation,
                dateDebut,
                dateFin
            );

            total += revenu;
        });
        setTotalRevenus(total);
    };

    const calculerTotalDepenses = (dateActuelle: Date) => {
        let total = 0;
        logement.frais.forEach((frais) => {
            total += calculerMontantFrais(frais, dateActuelle);
        });

        logement.periodesDeLocation.forEach((periode: PeriodeDeLocationDTO) => {
            periode.frais?.forEach((frais: FraisDTO) => {
                total += calculerMontantFrais(frais, dateActuelle);
            });
        });

        setTotalDepenses(total);
    };

    const calculerTauxOccupation = (dateActuelle: Date) => {
        if (logement.caracteristiques) {
            const dateAchat = new Date(logement.caracteristiques.dateAchat);
            const periodeTotaleJours = calculerDiffJours(dateAchat, dateActuelle);
            let joursOccupes = 0;
            logement.periodesDeLocation.forEach((periode) => {
                const dateDebut = new Date(periode.dateDeDebut);
                const dateFin = periode.dateDeFin ? new Date(periode.dateDeFin) : dateActuelle;
                if (dateFin >= dateAchat) {
                    const debutEffectif = dateDebut > dateAchat ? dateDebut : dateAchat;
                    joursOccupes += calculerDiffJours(debutEffectif, dateFin);
                }
            });
            setTauxOccupation(Math.round((joursOccupes / periodeTotaleJours) * 100));
        }
    };

    const calculerDiffJours = (dateDebut: Date, dateFin: Date) => {
        const diffTime = dateFin.getTime() - dateDebut.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Conversion en jours
    };

    const calculerMontantFrais = (frais: any, today: Date) => {
        if (frais.frequence === Frequence.PONCTUELLE) {
            return frais.montant;
        }
        const nbOccurrences = calculerOccurrences(frais.frequence, frais.dateDeDebut, frais.dateDeFin);
        return frais.montant * nbOccurrences;
    };

    const calculerOccurrences = (frequence: Frequence, dateDeDebut: string, dateDeFin: string | null): number => {
        if (!dateDeFin) {
            const dateActuelle = new Date();
            dateDeFin = dateActuelle.toISOString().split('T')[0];
        }

        const jours = Math.floor(
            (new Date(dateDeFin).getTime() - new Date(dateDeDebut).getTime()) / (1000 * 60 * 60 * 24)
        );

        const joursParFrequence: { [key in Frequence]: number } = {
            [Frequence.MENSUELLE]: 30,
            [Frequence.BIMESTRIELLE]: 60,
            [Frequence.TRIMESTRIELLE]: 90,
            [Frequence.SEMESTRIELLE]: 180,
            [Frequence.ANNUELLE]: 365,
            [Frequence.HEBDOMADAIRE]: 7,
            [Frequence.PONCTUELLE]: Infinity,
        };

        if (frequence === Frequence.PONCTUELLE) {
            return 1;
        }

        return Math.floor(jours / (joursParFrequence[frequence] || Infinity));
    };

    const calculerRevenuParPeriode = (tarif: number, type: TypeDeLocation, dateDebut: Date, dateFin: Date) => {
        const diffTime = dateFin.getTime() - dateDebut.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (type) {
            case TypeDeLocation.JOURNALIERE:
                return tarif * diffDays;
            case TypeDeLocation.MENSUELLE:
                const diffMonths = calculerDiffMois(dateDebut, dateFin);
                return tarif * diffMonths;
            default:
                return 0;
        }
    };

    const calculerDiffMois = (dateDebut: Date, dateFin: Date) => {
        const yearDiff = dateFin.getFullYear() - dateDebut.getFullYear();
        const monthDiff = dateFin.getMonth() - dateDebut.getMonth();
        return yearDiff * 12 + monthDiff + 1;
    };

    
  return (
    <View style={styles.statistiquesElement}>
      <View style={styles.customCard}>
        <View style={styles.customCardHeader}>
          <Text style={styles.headerTitle}>Statistiques</Text>
        </View>
        <View style={styles.statistiquesContenu}>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Total des revenus :</Text>
            <Text style={styles.fieldValue}>{totalRevenus.toFixed(2)} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Total des dépenses :</Text>
            <Text style={styles.fieldValue}>{totalDepenses.toFixed(2)} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Bénéfice net :</Text>
            <Text style={styles.fieldValue}>{(totalRevenus - totalDepenses).toFixed(2)} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Taux d'occupation :</Text>
            <Text style={styles.fieldValue}>{tauxOccupation} %</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statistiquesElement: {
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#143b86',
  },
  statistiquesContenu: {
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default StatistiquesElement;
