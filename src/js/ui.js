import { selectedCategoryCard, currentQuestion } from './main';

export function removeInitialGameUi() {
  document.getElementById('initial-game-ui').style.display = 'none';
  document.getElementById('main').style.backgroundImage = 'none';
}

export function displayFetchError(error) {
  const errorParagraph = document.getElementById('fetch-error-msg');
  errorParagraph.style.display = 'block';
  errorParagraph.innerText = error;
}

export function createCategoryCards(data) {
  const categoriesContainer = document.getElementById('categories-container');

  const categories = data.trivia_categories;

  categories.forEach((category) => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';
    categoryCard.id = category.id;
    categoryCard.innerText = category.name;
    categoriesContainer.appendChild(categoryCard);
  });

  selectedCategoryCard();
}

export function removeSelectedCategoryClass(categoryCard) {
  categoryCard.classList.remove('selected-category-card');
}

export function displayLoadingSpinner(display) {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.style.display = display;
}

export function displayCallToActions() {
  document.getElementById('game-options').style.display = 'flex';
  document.getElementById('start-game-btn').style.display = 'block';
}

export function displayOptionsError(display, error = '') {
  optionsError = document.getElementById('options-error');
  optionsError.style.display = display;
  optionsError.innerText = error;
}

export function pulseCategoryContainer() {
  document
    .getElementById('categories-container')
    .classList.add('pulse-categories-container');
}

export function removePulseCategoryContainer() {
  document
    .getElementById('categories-container')
    .classList.remove('pulse-categories-container');
}

export function removeGameOptionsUi() {
  document.getElementById('category-heading').style.display = 'none';
  document.getElementById('categories-container').style.display = 'none';
  document.getElementById('game-options').style.display = 'none';
  document.getElementById('start-game-btn').style.display = 'none';
}

export function createQuestion(data, currentQuestion) {
  console.log(data.results);
  const gameSectionContainer = document.getElementById(
    'game-section-container'
  );

  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-div';
  gameSectionContainer.appendChild(questionDiv);

  const questionParagraph = document.createElement('p');
  questionParagraph.className = 'question-div__paragraph';
  questionParagraph.innerText = atob(data.results[currentQuestion].question);
  questionDiv.appendChild(questionParagraph);

  const questionHeading = document.createElement('h3');
  questionHeading.className = 'question-div__heading';
  questionHeading.innerText = `Question ${currentQuestion + 1} of ${
    data.results.length
  }`;
  questionDiv.insertBefore(questionHeading, questionParagraph);
}
