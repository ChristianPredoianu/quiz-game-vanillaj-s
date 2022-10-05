import { displayPlayersTopScores } from './ui';

const playerNameInput = document.getElementById('player-name-input');

export function getPlayerScores() {
  const playerScores = JSON.parse(localStorage.getItem('playerScores') || '[]');
  const topScores = playerScores.sort((a, b) => b.score - a.score);
  const topThreePlayers = topScores.slice(0, 3);

  if (JSON.parse(localStorage.getItem('playerScores') !== null))
    displayPlayersTopScores(topThreePlayers);
}

export function setScoreToLocalStorage(selectedGameOptions, score) {
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
