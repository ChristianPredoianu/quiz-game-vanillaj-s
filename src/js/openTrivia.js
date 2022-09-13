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

export async function fetchSessionToken() {
  const url = 'https://opentdb.com/api_token.php?command=request';

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    displayFetchError(error);
  }
}
