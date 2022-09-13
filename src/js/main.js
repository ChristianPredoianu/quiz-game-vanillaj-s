import * as ui from './ui';
import { fetchSessionToken, useApi } from './openTrivia';

let selectedGameOptions = {};
let isGamePlaying = false;
let currentQuestion = 0;
let countdownTime = 5;
let countdownTimer;

document.getElementById('continue-btn').addEventListener('click', () => {
  initGameUi();
});

function initGameUi() {
  const categoryUrl = 'https://opentdb.com/api_category.php';

  document.getElementById('game-section-container').style.display = 'block';

  ui.removeInitialGameUi();

  useApi(categoryUrl).then((data) => {
    ui.createCategoryCards(data);
    ui.displayLoadingSpinner('none');
    ui.displayCallToActions();
  });

  ui.displayLoadingSpinner('block');
}

export function selectedCategoryCard() {
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach((categoryCard) => {
    categoryCard.addEventListener('click', function () {
      selectedGameOptions.category = this.id;
      console.log(selectedGameOptions);
      categoryCards.forEach((categoryCard) => {
        ui.removeSelectedCategoryClass(categoryCard);
        ui.removePulseCategoryContainer();
        ui.displayOptionsError('none');
      });

      this.classList.add('selected-category-card');
    });
  });
}

function additionalGameOptions() {
  const difficultySelect = document.getElementById('difficulty-select');
  const amountOfQuestions = document.getElementById(
    'amount-of-questions-select'
  );
  const radioBtns = document.querySelectorAll('.radio-wrapper__radio');

  selectedGameOptions.difficulty = difficultySelect.value;
  selectedGameOptions.amountOfQuestions = amountOfQuestions.value;

  radioBtns.forEach((radioBtn) => {
    if (radioBtn.checked) selectedGameOptions.questionsOptions = radioBtn.value;
  });

  return selectedGameOptions;
}

document.getElementById('start-game-btn').addEventListener('click', () => {
  checkIfUserSelectedCategory();
});

function checkIfUserSelectedCategory() {
  const gameOptions = additionalGameOptions();

  if (!gameOptions.category) {
    ui.displayOptionsError('block', 'You must select a category');
    ui.pulseCategoryContainer();
  } else {
    startGame();
  }
}

function startGame() {
  isGamePlaying = true;
  fetchSessionToken().then((data) => {
    const questionsUrl = `https://opentdb.com/api.php?amount=${selectedGameOptions.amountOfQuestions}&category=${selectedGameOptions.category}&difficulty=${selectedGameOptions.difficulty}&type=${selectedGameOptions.questionsOptions}&encode=base64&token=${data.token}`;

    useApi(questionsUrl).then((data) => {
      if (data.response_code === 1) {
        ui.displayOptionsError(
          'block',
          'No Results The API does not have enough questions for your query, try other options'
        );
      } else {
        playGame(data);
      }
    });
  });
  ui.removePulseCategoryContainer();
}

function playGame(data) {
  if (currentQuestion === 0) {
    initialQuestion(data);
  }
  document.getElementById('next-question-btn').addEventListener('click', () => {
    nextQuestion(data);
  });
}

function initialQuestion(data) {
  ui.removeGameOptionsUi();
  ui.displayOptionsError('none');
  ui.displayQuestion(data, 0);
  s;
  selectedGameOptions.questionsOptions === 'multiple'
    ? ui.createMultipleChoiceAnswers(data, 0)
    : ui.createTrueFalseAnswers(data, currentQuestion);
}

function nextQuestion(data) {
  currentQuestion++;
  countdownTime = 5;
  clearInterval(countdownTimer);
  initQuestionTimer();
  ui.removeCountdownAnimation();
  ui.displayQuestion(data, currentQuestion);
}

function initQuestionTimer() {
  const countdownNumber = document.getElementById('countdown-number');
  countdownNumber.innerText = countdownTime;

  countdownTimer = setInterval(() => {
    if (countdownTime <= 0) {
      clearInterval(countdownTimer);
    } else {
      --countdownTime;
      ui.addCountdownAnimation();
    }

    countdownNumber.innerText = countdownTime;
  }, 1000);
}
