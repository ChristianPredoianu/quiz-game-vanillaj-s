export function progressBarScore(score, numOfQuestions) {
  const scorePercentage = (score / numOfQuestions) * 100;
  const scoreProgress = document.querySelector('.player-score-progress__bar');
  scoreProgress.style.width = `${scorePercentage}%`;
  scoreProgress.innerText = `${scorePercentage}%`;
}
