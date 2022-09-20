import * as ui from './ui';
import { useApi } from './openTrivia';

const gameSectionContainer = document.getElementById('game-section-container'),
  difficultySelect = document.getElementById('difficulty-select'),
  amountOfQuestions = document.getElementById('amount-of-questions-select'),
  radioBtns = document.querySelectorAll('.radio-wrapper__radio'),
  countdownNumber = document.getElementById('countdown-number'),
  playerNameInput = document.getElementById('player-name-input');

const selectedGameOptions = {};

let score = 0,
  quizData = null,
  currentQuestion = 0,
  countdownTime = 15,
  countdownTimer = null,
  isAnswerSelected = false;

initGame();

function initGame() {
  getPlayerScores();

  document
    .getElementById('continue-btn')
    .addEventListener('click', getCategories);

  document
    .getElementById('start-game-btn')
    .addEventListener('click', checkIfUserSelectedCategory);

  document
    .getElementById('next-question-btn')
    .addEventListener('click', checkIfAnswerSelected);
}

function getPlayerScores() {
  const playerScores = JSON.parse(localStorage.getItem('playerScores') || '[]');
  const topScores = playerScores.sort((a, b) => b.score - a.score);
  const topThreePlayers = topScores.slice(0, 3);

  ui.displayPlayerScores(topThreePlayers);
}

function getCategories() {
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

    if (data.response_code === 1) {
      ui.displayOptionsError(
        'block',
        'No Results The API does not have enough questions for your query, try other options'
      );
    } else {
      playGame();
    }
  });

  ui.removePulseCategoryContainer();
}

function playGame() {
  console.log(quizData);
  if (currentQuestion === 0) {
    initialQuestion(quizData);
  }
}

function checkIfAnswerSelected() {
  !isAnswerSelected
    ? ui.displayOptionsError('block', 'Please select an answer')
    : nextQuestion(quizData);
}

function checkAnswersType() {
  const allAnswers = getAllAnswers(quizData, currentQuestion);
  const shuffledAnswers = shuffleAnswers(allAnswers);

  selectedGameOptions.questionsOptions === 'multiple'
    ? ui.displayMultipleChoiceAnswers(shuffledAnswers)
    : ui.displayTrueFalseAnswers(shuffledAnswers);
}

function getAllAnswers() {
  const { correct_answer, incorrect_answers } =
    quizData.results[currentQuestion];
  const answers = [correct_answer, ...incorrect_answers];

  return answers;
}

function shuffleAnswers(allAnswers) {
  return allAnswers.sort(() => Math.random() - 0.5);
}

function initialQuestion() {
  ui.removeGameOptionsUi();
  ui.displayOptionsError('none');
  checkAnswersType(quizData);
  ui.displayQuestion(quizData, currentQuestion);
  initQuestionTimer();
  checkIfCorrectAnswer(quizData, currentQuestion);
}

function nextQuestion() {
  const numberOfQuestions = quizData.results.length;
  isAnswerSelected = false;
  if (numberOfQuestions - 1 !== currentQuestion) {
    currentQuestion++;
    countdownTime = 15;
    ui.removeQuestion();
    ui.removeAnswers();
    checkAnswersType(quizData);
    clearInterval(countdownTimer);
    initQuestionTimer();
    ui.removeCountdownAnimation();
    ui.displayQuestion(quizData, currentQuestion);
    checkIfCorrectAnswer();
  } else {
    ui.showPlayerScore(score, numberOfQuestions);
    progressBarScore(numberOfQuestions);
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

function disableAllAnswers() {
  const answers = document.querySelectorAll('.answers-list__answer');
  answers.forEach((answer) => ui.disableAnswers(answer));
}

function disableRemainingAnswers(answers, currentTarget) {
  for (let i = 0; i < answers.length; i++) {
    if (currentTarget !== answers[i]) {
      ui.disableAnswers(answers[i]);
    }
  }
}

function progressBarScore(numOfQuestions) {
  const scorePercentage = (score / numOfQuestions) * 100;
  const scoreProgress = document.querySelector('.player-score-progress__bar');
  scoreProgress.style.width = `${scorePercentage}%`;
  scoreProgress.innerText = `${scorePercentage}%`;
}

function setScoreToLocalStorage() {
  const amountOfQuestions = selectedGameOptions.amountOfQuestions;
  const scorePercentage = (score / amountOfQuestions) * 100;

  const playerScores = JSON.parse(localStorage.getItem('playerScores') || '[]');

  const newPlayer = {
    player: playerNameInput.value,
    score: scorePercentage,
  };

  playerScores.push(newPlayer);
  localStorage.setItem('playerScores', JSON.stringify(playerScores));
}

document.getElementById('reset-game-btn').addEventListener('click', resetGame);

function resetGlobals() {
  quizData = null;
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
}

function resetGame() {
  if (playerNameInput.value === '') {
    ui.displayOptionsError('block', 'Please enter your name');
  } else {
    setScoreToLocalStorage();
    clearInterval(countdownTimer);
    resetGlobals();
    removeEventListeners();
    ui.resetGame();

    initGame();
  }
}
