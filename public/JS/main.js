import * as Events from './events.js';
import * as Sudoku from './sudoku.js'

export var puzzleTracker = {}, solvedPuzzle, animation;
puzzleTracker.board = [[], [], [], [], [], [], [], [], []];

window.onload = newGame;

export async function newGame() {
  initialize();
  var level = Sudoku.determineLevel();
  var puzzle = await Sudoku.getNewPuzzle(level).catch(err => console.error(err));
  Sudoku.fillPuzzle(puzzle);
  var data = await Sudoku.getSolution().catch(err => console.error(err));
  solvedPuzzle = data.solution;
  setTimeout(() => $(".loader").slideUp(), 2000);
}

function initialize() {
  puzzleTracker.board = [[], [], [], [], [], [], [], [], []];
  Sudoku.generateGrid();
  window.clearInterval(animation);
  bindEventListeners();
  hideScreen();
}

function bindEventListeners() {
  document.querySelector("input[name=tick]").addEventListener("input", Sudoku.showErrors);
  document.querySelector("#solve").addEventListener("click", solve);
  document.querySelector("#newGame").addEventListener("click", function (e) {
    e.stopImmediatePropagation();
    newGame();
  });
  Events.changeLevel();
  Events.triggerFocus();
  Events.editCellContent();
}

function hideScreen() {
  $(".loader").slideDown();
  document.body.style.backgroundColor = "#FFE";
  for (var i = 0; i < 81; i++) document.querySelectorAll(".cell")[i].classList.remove("cell-success");
  document.querySelector("input[name=tick]").checked = false;
  document.getElementById("message").textContent = "Contacting Server...";
}

function solve() {
  while (document.getElementsByClassName("error").length > 0) document.getElementsByClassName("error")[0].classList.remove("error");
  for (var row = 0; row < solvedPuzzle.length; row++)
    for (var col = 0; col < solvedPuzzle.length; col++) animation = setInterval(Sudoku.showSolution, 20 * row, row, col, animation);
}

