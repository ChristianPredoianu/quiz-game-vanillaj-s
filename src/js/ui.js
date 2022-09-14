import { selectedCategoryCard } from './main';

const initialGameUi = document.getElementById('initial-game-ui'),
  mainContainer = document.getElementById('main'),
  errorParagraph = document.getElementById('fetch-error-msg'),
  loadingSpinner = document.getElementById('loading-spinner'),
  categoriesContainer = document.getElementById('categories-container'),
  categoryHeading = document.getElementById('category-heading'),
  gameOptions = document.getElementById('game-options'),
  startGameBtn = document.getElementById('start-game-btn'),
  optionsError = document.getElementById('options-error'),
  svgCircle = document.getElementById('svg-circle'),
  questionDiv = document.getElementById('question-div'),
  countdown = document.getElementById('countdown'),
  answersList = document.getElementById('answers-list'),
  nextQuestionBtn = document.getElementById('next-question-btn');

export function removeInitialGameUi() {
  initialGameUi.style.display = 'none';
  mainContainer.style.backgroundImage = 'none';
}

export function displayFetchError(error) {
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
  loadingSpinner.style.display = display;
}

export function displayCallToActions() {
  gameOptions.style.display = 'flex';
  startGameBtn.style.display = 'block';
}

export function displayOptionsError(display, error = '') {
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
  categoryHeading.style.display = 'none';
  categoriesContainer.style.display = 'none';
  gameOptions.style.display = 'none';
  startGameBtn.style.display = 'none';
}

export function displayQuestion(data, currentQuestion) {
  questionDiv.style.display = 'block';
  nextQuestionBtn.style.display = 'block';
  countdown.style.display = 'block';
  nextQuestionBtn.style.display = 'block';

  const questionHeading = document.createElement('h3');
  questionHeading.className = 'question-div__heading';
  questionHeading.id = 'question-heading';
  questionHeading.innerText = `Question ${currentQuestion + 1} of ${
    data.results.length
  }`;
  questionHeading = questionHeading;

  const questionParagraph = document.createElement('p');
  questionParagraph.className = 'question-div__paragraph';
  questionParagraph.id = 'question-paragraph';
  questionParagraph.innerText = atob(data.results[currentQuestion].question);
  questionParagraph = questionParagraph;

  questionDiv.insertBefore(questionHeading, countdown);
  questionDiv.insertBefore(questionParagraph, countdown);
}

export function displayMultipleChoiceAnswers(data, currentQuestion) {
  const answers = getAnswers(data, currentQuestion);
  createAnswersLis(answers);
}

export function displayTrueFalseAnswers(data, currentQuestion) {
  const answers = getAnswers(data, currentQuestion);
  createAnswersLis(answers);
}

function getAnswers(data, currentQuestion) {
  const { correct_answer, incorrect_answers } = data.results[currentQuestion];
  const answers = [correct_answer, ...incorrect_answers];

  return answers;
}

function createAnswersLis(answers) {
  answers.forEach((answer) => {
    const answerLi = document.createElement('li');
    answerLi.className = 'answers-list__answer';
    answerLi.innerText = atob(answer);
    answersList.appendChild(answerLi);
  });
}

export function removeQuestion() {
  document.getElementById('question-heading').remove();
  document.getElementById('question-paragraph').remove();
}

export function removeAnswers() {
  const answers = document.querySelectorAll('.answers-list__answer');
  answers.forEach((answer) => answer.remove());
}

export function addCountdownAnimation() {
  svgCircle.classList.add('countdown-animation');
}

export function removeCountdownAnimation() {
  svgCircle.classList.remove('countdown-animation');
}

export function rightAnswer(selectedAnswer) {
  const answers = document.querySelectorAll('.answers-list__answer');

  selectedAnswer.classList.add('right-answer');

  /*   answer.classList.add('.right-answer'); */
}

export function wrongAnswer(answer) {
  /* answer.classList.add('wrong-answer'); */
}
