import { displayFetchError } from './ui';

export async function getCategories() {
  const url = 'https://opentdb.com/api_category.php';

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    displayFetchError(error);
  }
}

export async function getQuestions(gameOptions) {
  const url = `https://opentdb.com/api.php?amount=${gameOptions.amountOfQuestions}&category=${gameOptions.category}&difficulty=${gameOptions.difficulty}&type=${gameOptions.questionsOptions}&encode=base64`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    displayFetchError(error);
  }
}
