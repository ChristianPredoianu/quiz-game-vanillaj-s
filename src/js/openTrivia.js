export async function getCategories() {
  const url = 'https://opentdb.com/api_category.php';

  try {
    const response = await fetch(url);
    const categories = await response.json();

    return categories;
  } catch (error) {
    const errorParagraph = document.getElementById('fetch-error-msg');
    errorParagraph.style.display = 'block';
    errorParagraph.innerText = error;
  }
}
