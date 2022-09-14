import * as ui from './ui';
import { useApi } from './openTrivia';

const gameSectionContainer = document.getElementById('game-section-container'),
  difficultySelect = document.getElementById('difficulty-select'),
  amountOfQuestions = document.getElementById('amount-of-questions-select'),
  radioBtns = document.querySelectorAll('.radio-wrapper__radio'),
  countdownNumber = document.getElementById('countdown-number');

const selectedGameOptions = {};
let isGamePlaying = false,
  score = 0,
  currentQuestion = 0,
  countdownTime = 5,
  countdownTimer = null;

document.getElementById('continue-btn').addEventListener('click', () => {
  initGameUi();
});

function initGameUi() {
  const categoryUrl = 'https://opentdb.com/api_category.php';

  gameSectionContainer.style.display = 'block';

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

  const questionsUrl = `https://opentdb.com/api.php?amount=${selectedGameOptions.amountOfQuestions}&category=${selectedGameOptions.category}&difficulty=${selectedGameOptions.difficulty}&type=${selectedGameOptions.questionsOptions}&encode=base64`;

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

function checkQuestionType(data) {
  selectedGameOptions.questionsOptions === 'multiple'
    ? ui.displayMultipleChoiceAnswers(data, currentQuestion)
    : ui.displayTrueFalseAnswers(data, currentQuestion);
}

function initialQuestion(data) {
  ui.removeGameOptionsUi();
  ui.displayOptionsError('none');
  checkQuestionType(data);
  ui.displayQuestion(data, currentQuestion);
  initQuestionTimer();
  checkIfCorrectAnswer(data, currentQuestion);
}

function nextQuestion(data) {
  currentQuestion++;
  countdownTime = 5;
  ui.removeQuestion();
  ui.removeAnswers();
  checkQuestionType(data);
  clearInterval(countdownTimer);
  ui.removeCountdownAnimation();
  initQuestionTimer();
  ui.displayQuestion(data, currentQuestion);
  checkIfCorrectAnswer(data, currentQuestion);
}

function initQuestionTimer() {
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

function checkIfCorrectAnswer(data, currentQuestion) {
  const answers = document.querySelectorAll('.answers-list__answer');
  const correctAnswer = data.results[currentQuestion].correct_answer;
  answers.forEach((answer) => {
    answer.addEventListener('click', () => {
      if (answer.innerText === atob(correctAnswer)) {
        ++score;
        //add right ui answer class here
        ui.rightAnswer(answer);
        console.log(answer);
      } else if (countdownTime === 0) {
        ui.rightAnswer(answer);
        //add right ui answer class here
      } else {
        ui.wrongAnswer(answer);
        // display ui wrong answer class here
      }
    });
  });
}
