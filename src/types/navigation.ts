import { LogementDTO } from "../models/entites/Logement/LogementDTO.model";

export type RootStackParamList = {
    Connexion: undefined;
    Inscription: undefined;
    Logements: undefined;
    Logement: { logement: LogementDTO };
  };
  