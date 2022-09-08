import { getCategories } from './openTrivia';
import { getUserSelectedCategory } from './main';

export function initGameUi() {
  document.getElementById('game-section-container').style.display = 'block';
  removeInitialGameUi();

  getCategories().then((data) => {
    createCategoryCards(data);
    displayLoadingSpinner('none');
    displayCallToActions();
  });

  displayLoadingSpinner('block');
}

function createCategoryCards(data) {
  const categoriesContainer = document.getElementById('categories-container');

  const categories = data.trivia_categories;

  categories.forEach((category) => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';
    categoryCard.innerText = category.name;
    categoriesContainer.appendChild(categoryCard);
  });
  addEventListenerToCategoryCards();
}

export function addEventListenerToCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach((categoryCard) => {
    categoryCard.addEventListener('click', function () {
      getUserSelectedCategory(this.innerText);

      categoryCards.forEach((categoryCard) => {
        categoryCard.classList.remove('selected-category-card');
      });

      this.classList.add('selected-category-card');
    });
  });
}

function removeInitialGameUi() {
  document.getElementById('initial-game-ui').style.display = 'none';
  document.getElementById('main').style.backgroundImage = 'none';
}

function displayLoadingSpinner(display) {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.style.display = display;
}

function displayCallToActions() {
  document.getElementById('game-options').style.display = 'flex';
  document.getElementById('start-game-btn').style.display = 'block';
}
