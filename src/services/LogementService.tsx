import { SuccessResponse } from '../models/SuccessResponse';
import { ErrorResponse } from '../models/ErrorResponse';
import { apiUrl } from '@env';
import { LogementDTO } from '../models/entites/Logement/LogementDTO.model';
import { authFetch } from './http-helpers';
export class LogementService {
  private apiUrl = `${apiUrl}/logements`;

  /**
   * Crée un nouveau logement.
   * @param logementDTO Les données du logement à créer.
   * @returns Une promesse contenant les données du logement créé.
   */
  async creerLogement(logementDTO: LogementDTO): Promise<LogementDTO | ErrorResponse> {
    try {
      const response = await authFetch(`${this.apiUrl}/ajouter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logementDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue lors de la création du logement.');
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Liste tous les logements.
   * @returns Une promesse contenant la liste des logements.
   */
  async listerLogements(): Promise<LogementDTO[]> {
    try {
      const response = await authFetch(`${this.apiUrl}/lister`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue lors de la récupération des logements.');
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Obtient un logement par son ID.
   * @param logementMasqueId L'identifiant du logement à récupérer.
   * @returns Une promesse contenant les données du logement.
   */
  async obtenirLogement(logementMasqueId: string): Promise<LogementDTO | ErrorResponse> {
    try {
      const response = await authFetch(`${this.apiUrl}/${logementMasqueId}/obtenir`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue lors de la récupération du logement.');
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Supprime un logement par son ID.
   * @param logementMasqueId L'identifiant du logement à supprimer.
   * @returns Une promesse contenant la réponse du serveur (succès ou erreur).
   */
  async supprimerLogement(logementMasqueId: string): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await authFetch(`${this.apiUrl}/${logementMasqueId}/supprimer`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue lors de la suppression du logement.');
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }
}
