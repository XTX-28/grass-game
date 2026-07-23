export function getHighScore(): number {
  const val = localStorage.getItem('grass-game:high-score');
  return val ? parseFloat(val) : 0;
}

export function setHighScore(score: number): void {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem('grass-game:high-score', score.toString());
  }
}
