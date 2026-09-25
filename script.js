const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = [...document.querySelectorAll(".cell")];
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const scores = { X: 0, O: 0, draw: 0 };

let board = Array(9).fill("");
let current = "X";
let over = false;

function winner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
    cell.classList.toggle("x", board[i] === "X");
    cell.classList.toggle("o", board[i] === "O");
    cell.disabled = over || Boolean(board[i]);
  });
}

function setStatus(text) {
  statusEl.textContent = text;
}

function finish(result) {
  over = true;
  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (result.player) {
    result.line.forEach((i) => cells[i].classList.add("win"));
    scores[result.player] += 1;
    document.getElementById(`score-${result.player.toLowerCase()}`).textContent =
      scores[result.player];
    setStatus(`${result.player} wins`);
    return;
  }

  scores.draw += 1;
  document.getElementById("score-draw").textContent = scores.draw;
  setStatus("It’s a draw");
}

function play(index) {
  if (over || board[index]) return;

  board[index] = current;
  const result = winner();
  if (result) {
    render();
    finish(result);
    return;
  }

  if (board.every(Boolean)) {
    render();
    finish({ player: null, line: [] });
    return;
  }

  current = current === "X" ? "O" : "X";
  render();
  setStatus(`${current}’s turn`);
}

function reset() {
  board = Array(9).fill("");
  current = "X";
  over = false;
  cells.forEach((cell) => cell.classList.remove("win"));
  render();
  setStatus("X’s turn");
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => play(Number(cell.dataset.index)));
});
resetBtn.addEventListener("click", reset);
render();
