import * as ui from './ui';
import { useApi } from './openTrivia';
import { getPlayerScores, setScoreToLocalStorage } from './localStorageScores';
import { progressBarScore } from './progressBarScore';

const difficultySelect = document.getElementById('difficulty-select'),
  amountOfQuestions = document.getElementById('amount-of-questions-select'),
  radioBtns = document.querySelectorAll('.radio-wrapper__radio'),
  countdownNumber = document.getElementById('countdown-number'),
  playerNameInput = document.getElementById('player-name-input');

let score = 0,
  selectedGameOptions = {},
  quizData = null,
  currentQuestion = 0,
  countdownTime = 15,
  countdownTimer = null,
  isAnswerSelected = false;

initGame();

function initGame() {
  getPlayerScores();
  initEventListeners();
}

function initEventListeners() {
  document
    .getElementById('continue-btn')
    .addEventListener('click', getCategories);

  document
    .getElementById('start-game-btn')
    .addEventListener('click', checkIfUserSelectedCategory);

  document
    .getElementById('next-question-btn')
    .addEventListener('click', checkIfAnswerSelected);

  document
    .getElementById('reset-game-btn')
    .addEventListener('click', resetGame);
}

function getCategories() {
  const categoryUrl = 'https://opentdb.com/api_category.php';

  ui.removeInitialGameUi();
  ui.displayGameSection();

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
  const questionsUrl = `https://opentdb.com/api.php?amount=${selectedGameOptions.amountOfQuestions}&category=${selectedGameOptions.category}&difficulty=${selectedGameOptions.difficulty}&type=${selectedGameOptions.questionsOptions}&encode=base64`;

  useApi(questionsUrl).then((data) => {
    quizData = data;

    data.response_code === 1
      ? ui.displayOptionsError(
          'block',
          'No Results The API does not have enough questions for your query, try other options'
        )
      : playGame();
  });

  ui.removePulseCategoryContainer();
}

function playGame() {
  if (currentQuestion === 0) {
    initialQuestion(quizData);
  }
}

function initQuestionTimer() {
  countdownNumber.innerText = countdownTime;

  countdownTimer = setInterval(() => {
    if (countdownTime === 0) {
      clearInterval(countdownTimer);
      disableAllAnswers();
      isAnswerSelected = true;
    } else {
      --countdownTime;
      ui.addCountdownAnimation();
    }

    countdownNumber.innerText = countdownTime;
  }, 1000);
}

function initialQuestion() {
  ui.removeGameOptionsUi();
  ui.displayOptionsError('none');
  checkAnswersType();
  ui.displayQuestion(quizData, currentQuestion);
  initQuestionTimer();
  checkIfCorrectAnswer(quizData, currentQuestion);
}

function getAllAnswers() {
  const { correct_answer, incorrect_answers } =
    quizData.results[currentQuestion];
  const answers = [correct_answer, ...incorrect_answers];

  return answers;
}

function checkAnswersType() {
  const allAnswers = getAllAnswers();
  const shuffledAnswers = shuffleAnswers(allAnswers);

  selectedGameOptions.questionsOptions === 'multiple'
    ? ui.displayMultipleChoiceAnswers(shuffledAnswers)
    : ui.displayTrueFalseAnswers(shuffledAnswers);
}

function shuffleAnswers(allAnswers) {
  return allAnswers.sort(() => Math.random() - 0.5);
}

function checkIfAnswerSelected() {
  !isAnswerSelected
    ? ui.displayOptionsError('block', 'Please select an answer')
    : nextQuestion();
}

function nextQuestion() {
  const numberOfQuestions = quizData.results.length;
  isAnswerSelected = false;

  if (numberOfQuestions - 1 !== currentQuestion) {
    currentQuestion++;
    countdownTime = 15;
    ui.removeQuestion();
    checkAnswersType();
    clearInterval(countdownTimer);
    initQuestionTimer();
    ui.removeCountdownAnimation();
    ui.displayQuestion(quizData, currentQuestion);
    checkIfCorrectAnswer();
  } else {
    gameOver(numberOfQuestions);
  }
}

function disableAllAnswers() {
  const answers = document.querySelectorAll('.answers-list__answer');
  answers.forEach((answer) => ui.disableAnswers(answer));
}

function checkIfCorrectAnswer() {
  isAnswerSelected = false;
  const answers = document.querySelectorAll('.answers-list__answer');
  const correctAnswer = quizData.results[currentQuestion].correct_answer;

  answers.forEach((answer) => {
    answer.addEventListener('click', (e) => {
      isAnswerSelected = true;
      ui.displayOptionsError('none');
      if (answer.innerText === atob(correctAnswer)) {
        ++score;
        ui.rightAnswer(e.currentTarget);
      } else {
        ui.wrongAnswer(answer);
        isAnswerSelected = true;
      }
      disableRemainingAnswers(answers, e.currentTarget);
    });
  });
}

function disableRemainingAnswers(answers, currentTarget) {
  for (let i = 0; i < answers.length; i++) {
    if (currentTarget !== answers[i]) {
      ui.disableAnswers(answers[i]);
    }
  }
}

function gameOver(numberOfQuestions) {
  ui.showPlayerScore(score, numberOfQuestions);
  progressBarScore(score, numberOfQuestions);
}

document.getElementById('reset-game-btn').addEventListener('click', resetGame);

function resetGame() {
  if (playerNameInput.value === '') {
    ui.displayOptionsError('block', 'Please enter your name');
  } else {
    setScoreToLocalStorage(selectedGameOptions, score);
    clearInterval(countdownTimer);
    resetGlobals();
    removeEventListeners();
    ui.resetGameUi();

    initGame();
  }
}

function resetGlobals() {
  quizData = null;
  selectedGameOptions = {};
  score = 0;
  currentQuestion = 0;
  countdownTime = 15;
  countdownTimer = null;
  isAnswerSelected = false;
}

function removeEventListeners() {
  document
    .getElementById('next-question-btn')
    .removeEventListener('click', checkIfAnswerSelected);
  document
    .getElementById('start-game-btn')
    .removeEventListener('click', checkIfUserSelectedCategory);
  document
    .getElementById('continue-btn')
    .removeEventListener('click', getCategories);

  document
    .getElementById('reset-game-btn')
    .removeEventListener('click', resetGame);
}
