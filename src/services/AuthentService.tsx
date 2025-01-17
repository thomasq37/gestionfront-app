import { RegisterUserRequestDTO } from '../models/RegisterUserRequestDTO';
import { SuccessResponse } from '../models/SuccessResponse';
import { ErrorResponse } from '../models/ErrorResponse';
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

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }
}
