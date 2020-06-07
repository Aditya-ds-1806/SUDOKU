var solvedPuzzle, animation;
var puzzleTracker = {};
puzzleTracker.board = [[], [], [], [], [], [], [], [], []];
var corsProxy = "https://cors-anywhere.herokuapp.com/";
var puzzleUrl = "http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=";

window.onload = newGame;

async function newGame() {
  initialize();
  var level = determineLevel();
  var puzzle = await getNewPuzzle(level).catch(err => console.error(err));
  sudokuPuzzleFill(puzzle);
  setTimeout(() => $(".loader").slideUp(), 2000);
}

function determineLevel() {
  var level, levelText = document.querySelector("#navbarDropdown").textContent;
  if (levelText === "Easy") level = 1;
  else if (levelText === "Medium") level = 2;
  else level = 3;
  return level;
}

function getNewPuzzle(level) {
  return $.ajax({
    method: 'GET',
    url: corsProxy + puzzleUrl + level,
    dataType: 'json'
  });
}

function hideScreen() {
  $(".loader").slideDown();
  document.body.style.backgroundColor = "#FFE";
  for (var i = 0; i < 81; i++) document.querySelectorAll(".cell")[i].classList.remove("cell-success");
  document.querySelector("input[name=tick]").checked = false;
  document.getElementById("message").textContent = "Contacting Server...";
}

function initialize() {
  puzzleTracker.board = [[], [], [], [], [], [], [], [], []];
  sudokuGridGenerate();
  // clearGrid();
  window.clearInterval(animation);
  bindEventListeners();
  hideScreen();
}

function clearGrid() {
  for (var i = 0; i < 9; i++)
    for (var j = 0; j < 9; j++)
      document.getElementById(i.toString() + j.toString()).textContent = "";
}

function bindEventListeners() {
  document.querySelector("input[name=tick]").addEventListener("input", showErrors);
  document.querySelector("#solve").addEventListener("click", solve);
  document.querySelector("#newGame").addEventListener("click", function (e) {
    e.stopImmediatePropagation();
    newGame();
  });
  changeLevel();
  triggerFocus();
  editCellContent();
}

function changeLevel() {
  for (var i = 0; i < 3; i++) {
    document.querySelectorAll(".dropdown-menu a")[i].addEventListener("click", function (e) {
      e.stopImmediatePropagation();
      document.querySelector("#navbarDropdown").textContent = this.textContent;
      newGame();
    });
  }
}

function solve() {
  while (document.getElementsByClassName("error").length > 0) {
    document.getElementsByClassName("error")[0].classList.remove("error");
  }

  for (var row = 0; row < solvedPuzzle.length; row++) {
    for (var col = 0; col < solvedPuzzle.length; col++) {
      animation = setInterval(showSolution, 20 * row, row, col, animation);
    }
  }
}

function showSolution(row, col, animation) {
  document.body.style.backgroundColor = "#98fb98";
  for (var i = 0; i < document.querySelectorAll("td").length; i++) {
    document.querySelectorAll("td")[i].classList.add("cell-success");
  }
  window.clearInterval(animation);
  document.getElementById(row.toString() + col.toString()).textContent = solvedPuzzle[row][col];
  document.querySelector("body").removeEventListener("keydown", keyboardControls);
  for (var i = 0; i < document.querySelectorAll(".buttons button").length; i++) {
    document.querySelectorAll(".buttons button")[i].removeEventListener("click", btnClick);
  }
}

function triggerFocus() {
  for (var i = 0; i < document.querySelectorAll("td").length; i++) {
    document.querySelectorAll("td")[i].addEventListener("click", function () {
      if (!this.classList.contains("non-edit")) {
        if (document.querySelector(".focus")) {
          document.querySelector(".focus").classList.remove("focus");
        }
        this.classList.add("focus");
      }
    });
  }
}

function encodeBoard(board) {
  return board.reduce(function (result, row, i) {
    return result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`
  }, '')
}

function encodeParams(params) {
  return Object.keys(params)
    .map(function (key) {
      return key + '=' + `%5B${encodeBoard(params[key])}%5D`
    })
    .join('&')
}

function getSolution() {
  console.log(puzzleTracker);
  $.ajax({
    type: 'POST',
    url: 'https://sugoku2.herokuapp.com/solve',
    data: encodeParams(puzzleTracker),
    contentType: 'application/x-www-form-urlencoded',
    success: function (d) {
      solvedPuzzle = d.solution;
      console.log(d);
    }
  });
}

function puzzleUpdate() {
  for (var row = 0; row < puzzleTracker.board.length; row++) {
    for (var col = 0; col < puzzleTracker.board.length; col++) {
      if (document.getElementById(row.toString() + col.toString()).textContent !== "") {
        puzzleTracker.board[row][col] = Number(document.getElementById(row.toString() + col.toString()).textContent);
      }
    }
  }
}

function sudokuPuzzleFill(data) {
  clearGrid();
  document.getElementById("message").textContent = "Generating Sudoku...";
  while (document.querySelectorAll(".non-edit").length > 0) {
    document.querySelectorAll(".non-edit")[0].classList.remove("non-edit");
  }
  for (var i = 0; i < data.squares.length; i++) {
    document.getElementById(data.squares[i].x.toString() + data.squares[i].y.toString()).textContent = data.squares[i].value;
    document.getElementById(data.squares[i].x.toString() + data.squares[i].y.toString()).classList.add("non-edit");
  }
  console.log("done");
  objectStructureDefine();
  getSolution();
}

function objectStructureDefine() {
  for (var row = 0; row < puzzleTracker.board.length; row++) {
    for (var col = 0; col < puzzleTracker.board.length; col++) {
      if (document.getElementById(row.toString() + col.toString()).textContent === "") {
        puzzleTracker.board[row].push(0);
      } else {
        puzzleTracker.board[row].push(Number(document.getElementById(row.toString() + col.toString()).textContent));
      }
    }
  }
}

function sudokuGridGenerate() {
  var tBody = document.querySelector("#tableBody");
  var html = "<tr>";
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {
      html = html + '<td class="cell" id="' + row + col + '"></td>';
    }
    html = html + "</tr>";
  }
  tBody.innerHTML = html;
}

function showErrors() {
  if (document.querySelector("input[name=tick]").checked) {
    for (var row = 0; row < solvedPuzzle.length; row++) {
      for (var col = 0; col < solvedPuzzle.length; col++) {
        if (solvedPuzzle[row][col] !== puzzleTracker.board[row][col] && puzzleTracker.board[row][col] !== 0) {
          document.getElementById(row.toString() + col.toString()).classList.add("error");
        }
        else {
          document.getElementById(row.toString() + col.toString()).classList.remove("error");
        }
      }
    }
  } else {
    if (document.querySelectorAll(".error")[0]) {
      while (document.getElementsByClassName("error").length > 0) {
        document.getElementsByClassName("error")[0].classList.remove("error");
      }
    }
  }
}

function editCellContent() {
  for (var i = 0; i < document.querySelectorAll(".buttons button").length; i++) {
    document.querySelectorAll(".buttons button")[i].addEventListener("click", btnClick);
    document.querySelector("body").addEventListener("keydown", keyboardControls);
  }
}

function btnClick() {
  if (document.querySelector(".focus")) {
    document.querySelector(".focus").textContent = this.textContent;
    puzzleUpdate();
    showErrors();
  }
  puzzleStatus();
}

function puzzleStatus() {
  var filled = 0;
  for (var i = 0; i < 81; i++) {
    if (document.querySelectorAll("td")[i].textContent === "") {
      filled++;
    }
  }
  console.log(filled);
  if (filled === 0) {
    console.log("running");
    loop1:
    for (var row = 0; row < solvedPuzzle.length; row++) {
      for (var col = 0; col < solvedPuzzle.length; col++) {
        if (solvedPuzzle[row][col] !== puzzleTracker.board[row][col] && puzzleTracker.board[row][col] !== 0) {
          document.querySelector("input[name=tick]").checked = true;
          showErrors();
          break loop1;
        }
        else {
          if (row === 8 && col === 8) {
            console.log("solved");
            document.body.style.backgroundColor = "#98fb98";
            for (var i = 0; i < 81; i++) {
              document.querySelectorAll(".cell")[i].classList.add("cell-success");
            }
          }
        }
      }
    }
  }
}

function keyboardControls(e) {
  if (document.querySelector(".focus")) {
    if (e.keyCode === 49 || e.keyCode === 97) {
      document.querySelector(".focus").textContent = 1;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 50 || e.keyCode === 98) {
      document.querySelector(".focus").textContent = 2;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 51 || e.keyCode === 99) {
      document.querySelector(".focus").textContent = 3;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 52 || e.keyCode === 100) {
      document.querySelector(".focus").textContent = 4;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 53 || e.keyCode === 101) {
      document.querySelector(".focus").textContent = 5;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 54 || e.keyCode === 102) {
      document.querySelector(".focus").textContent = 6;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 55 || e.keyCode === 103) {
      document.querySelector(".focus").textContent = 7;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 56 || e.keyCode === 104) {
      document.querySelector(".focus").textContent = 8;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 57 || e.keyCode === 105) {
      document.querySelector(".focus").textContent = 9;
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
    if (e.keyCode === 46 || e.keyCode === 8) {
      document.querySelector(".focus").textContent = "";
      puzzleUpdate();
      showErrors();
      puzzleStatus();
    }
  }
}
