import * as ui from './ui';
import { getCategories, getQuestions } from './openTrivia';

let selectedGameOptions = {};
let isGamePlaying = false;
export let currentQuestion = 0;

document.getElementById('continue-btn').addEventListener('click', () => {
  initGameUi();
});

function initGameUi() {
  document.getElementById('game-section-container').style.display = 'block';
  ui.removeInitialGameUi();

  getCategories().then((data) => {
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

//play game
document.getElementById('start-game-btn').addEventListener('click', () => {
  playGame();
});

function playGame() {
  const gameOptions = additionalGameOptions();

  if (!gameOptions.category) {
    ui.displayOptionsError('block', 'You must select a category');
    ui.pulseCategoryContainer();
  } else {
    isGamePlaying = true;
    getQuestions(gameOptions).then((data) => {
      if (data.response_code === 1) {
        ui.displayOptionsError(
          'block',
          'No Results The API does not have enough questions for your query, try other options'
        );
      } else {
        ui.displayOptionsError('none');
        ui.removeGameOptionsUi();
        ui.createQuestion(data, currentQuestion);
      }
    });
    ui.removePulseCategoryContainer();
  }
}
