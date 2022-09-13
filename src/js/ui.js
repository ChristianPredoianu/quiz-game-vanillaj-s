import { selectedCategoryCard } from './main';

const categoriesContainer = document.getElementById('categories-container');
const gameOptions = document.getElementById('game-options');
const svgCircle = document.getElementById('svg-circle');
const questionDiv = document.getElementById('question-div');

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
  document.getElementById('loading-spinner').style.display = display;
}

export function displayCallToActions() {
  gameOptions.style.display = 'flex';
  document.getElementById('start-game-btn').style.display = 'block';
}

export function displayOptionsError(display, error = '') {
  optionsError = document.getElementById('options-error');
  optionsError.style.display = display;
  optionsError.innerText = error;
}

export function pulseCategoryContainer() {
  categoriesContainer.classList.add('pulse-categories-container');
}

export function removePulseCategoryContainer() {
  categoriesContainer.classList.remove('pulse-categories-container');
}

export function removeGameOptionsUi() {
  document.getElementById('category-heading').style.display = 'none';
  categoriesContainer.style.display = 'none';
  gameOptions.style.display = 'none';
  document.getElementById('start-game-btn').style.display = 'none';
}

export function displayQuestion(data, currentQuestion) {
  questionDiv.style.display = 'block';
  document.getElementById('next-question-btn').style.display = 'block';

  const questionHeading = document.getElementById('question-heading');
  const questionParagraph = document.getElementById('question-paragraph');
  const countdown = document.getElementById('countdown');
  countdown.style.display = 'block';

  document.getElementById('next-question-btn').style.display = 'block';

  console.log(currentQuestion);

  questionParagraph.innerText = atob(data.results[currentQuestion].question);

  questionHeading.innerText = `Question ${currentQuestion + 1} of ${
    data.results.length
  }`;
}

export function createMultipleChoiceAnswers(data, currentQuestion) {
  console.log(data.results[currentQuestion]);
}

export function createTrueFalseAnswers(data, currentQuestion) {}

export function addCountdownAnimation() {
  svgCircle.classList.add('countdown-animation');
}

export function removeCountdownAnimation() {
  svgCircle.classList.remove('countdown-animation');
}
