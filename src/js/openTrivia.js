import { displayFetchError } from './ui';

export async function useApi(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    displayFetchError(error);
  }
}
