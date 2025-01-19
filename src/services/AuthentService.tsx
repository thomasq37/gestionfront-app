import { RegisterUserRequestDTO } from '../models/auth/RegisterUserRequestDTO.model';
import { SuccessResponse } from '../models/exception/SuccessResponse.model';
import { ErrorResponse } from '../models/exception/ErrorResponse.model';
import { apiUrl } from '@env';

export class AuthentService {
  private apiUrl = apiUrl; // URL de l'API en fonction de l'environnement

  /**
   * Enregistre un nouvel utilisateur.
   * @param registerUserRequestDTO Les données d'inscription de l'utilisateur.
   * @returns Une promesse contenant la réponse du serveur (succès ou erreur).
   */
  async registerUser(registerUserRequestDTO: RegisterUserRequestDTO): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await fetch(`${apiUrl}/auth/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerUserRequestDTO),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)

        throw new Error(errorData.error || 'Une erreur est survenue.');
      }
      
      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Authentifie un utilisateur existant.
   * @param authenticateUserRequestDTO Les données d'authentification de l'utilisateur.
   * @returns Une promesse contenant la réponse du serveur (succès).
   */
  async authenticateUser(authenticateUserRequestDTO: RegisterUserRequestDTO): Promise<SuccessResponse> {
    try {
      const response = await fetch(`${apiUrl}/auth/connexion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authenticateUserRequestDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue.');
      }
      const data = await response.json();
      if (!data.message) {
        throw new Error('Token introuvable dans la réponse.');
      }
  
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
