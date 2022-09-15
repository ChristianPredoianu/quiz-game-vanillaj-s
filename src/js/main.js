import * as ui from './ui';
import { useApi } from './openTrivia';

const gameSectionContainer = document.getElementById('game-section-container'),
  difficultySelect = document.getElementById('difficulty-select'),
  amountOfQuestions = document.getElementById('amount-of-questions-select'),
  radioBtns = document.querySelectorAll('.radio-wrapper__radio'),
  countdownNumber = document.getElementById('countdown-number');

const selectedGameOptions = {};

let score = 0,
  currentQuestion = 0,
  countdownTime = 15,
  countdownTimer = null,
  isAnswerSelected = false;

document.getElementById('continue-btn').addEventListener('click', initGame);

function initGame() {
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

document
  .getElementById('start-game-btn')
  .addEventListener('click', checkIfUserSelectedCategory);

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
    !isAnswerSelected
      ? ui.displayOptionsError('block', 'Please select an answer')
      : nextQuestion(data);
  });
}

function checkAnswersType(data) {
  const allAnswers = getAllAnswers(data, currentQuestion);
  const shuffledAnswers = shuffleAnswers(allAnswers);

  selectedGameOptions.questionsOptions === 'multiple'
    ? ui.displayMultipleChoiceAnswers(shuffledAnswers)
    : ui.displayTrueFalseAnswers(shuffledAnswers);
}

function getAllAnswers(data, currentQuestion) {
  const { correct_answer, incorrect_answers } = data.results[currentQuestion];
  const answers = [correct_answer, ...incorrect_answers];

  return answers;
}

function shuffleAnswers(allAnswers) {
  return allAnswers.sort(() => Math.random() - 0.5);
}

function initialQuestion(data) {
  ui.removeGameOptionsUi();
  ui.displayOptionsError('none');
  checkAnswersType(data);
  ui.displayQuestion(data, currentQuestion);
  initQuestionTimer();
  checkIfCorrectAnswer(data, currentQuestion);
}

function nextQuestion(data) {
  const numberOfQuestions = data.results.length;

  if (numberOfQuestions - 1 !== currentQuestion) {
    currentQuestion++;
    countdownTime = 15;
    isAnswerSelected = false;
    ui.removeQuestion();
    ui.removeAnswers();
    checkAnswersType(data);
    clearInterval(countdownTimer);
    initQuestionTimer();
    ui.removeCountdownAnimation();
    ui.displayQuestion(data, currentQuestion);
    checkIfCorrectAnswer(data, currentQuestion);
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

function checkIfCorrectAnswer(data, currentQuestion) {
  const answers = document.querySelectorAll('.answers-list__answer');
  const correctAnswer = data.results[currentQuestion].correct_answer;

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
  const playerNameInput = document.getElementById('player-name-input');
  const amountOfQuestions = selectedGameOptions.amountOfQuestions;
  const scorePercentage = (score / amountOfQuestions) * 100;

  if (playerNameInput.value === '') {
    ui.displayOptionsError('block', 'Please enter your name');
  }
  if (localStorage.getItem('scores') === null) {
    const players = [
      {
        name: playerNameInput.value,
        score: scorePercentage,
      },
    ];

    localStorage.setItem('scores', JSON.stringify(players));
  } else {
    const newPlayer = {
      name: playerNameInput.value,
      score: scorePercentage,
    };
    const oldData = JSON.parse(localStorage.getItem('scores'));
    console.log(oldData);
    const newData = oldData.push(newPlayer);
    localStorage.setItem('scores', JSON.stringify(newData));
    console.log(newData);
  }

  /*   const newPlayersScores = existingPlayersScores.push(newPlayer); */
  /* 
    localStorage.setItem('scores', JSON.stringify(newPlayersScores)); */
}

document.getElementById('reset-game-btn').addEventListener('click', resetGame);

function resetGame() {
  setScoreToLocalStorage();
  score = 0;
  currentQuestion = 0;
  countdownTime = 15;
  countdownTimer = null;
  isAnswerSelected = false;

  document.getElementById('continue-btn').removeEventListener('click');
  document.getElementById('start-game-btn').removeEventListener('click');
  document.getElementById('next-question-btn').removeEventListener('click');

  ui.resetGame();
}
