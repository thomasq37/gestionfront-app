import AsyncStorage from '@react-native-async-storage/async-storage';

export async function authFetch(url: RequestInfo, options: RequestInit = {}): Promise<Response> {
  try {
    const token = await AsyncStorage.getItem('authToken');
    options.headers = new Headers(options.headers || {});
    if (token) {
      (options.headers as Headers).set('Authorization', `Bearer ${token}`);
    }
    (options.headers as Headers).set('Content-Type', 'application/json');

    return await fetch(url, options);
  } catch (error: any) {
    throw new Error('Erreur lors de la configuration de la requête : ' + error.message);
  }
}
