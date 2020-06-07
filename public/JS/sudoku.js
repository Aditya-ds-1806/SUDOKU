import { puzzleTracker, solvedPuzzle } from './main.js';
import { encodeParams } from './helper.js';
import { keyboardControls } from './keyboard.js';
import { btnClick } from './events.js';


var corsProxy = "https://cors-anywhere.herokuapp.com/";
var puzzleUrl = "http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=";

export function getNewPuzzle(level) {
    return $.ajax({
        method: 'GET',
        url: corsProxy + puzzleUrl + level,
        dataType: 'json'
    });
}

export async function getSolution() {
    return $.ajax({
        type: 'POST',
        url: 'https://sugoku2.herokuapp.com/solve',
        data: encodeParams(puzzleTracker),
        contentType: 'application/x-www-form-urlencoded'
    });
}

export function puzzleUpdate() {
    for (var row = 0; row < puzzleTracker.board.length; row++)
        for (var col = 0; col < puzzleTracker.board.length; col++)
            if (document.getElementById(row.toString() + col.toString()).textContent !== "")
                puzzleTracker.board[row][col] = Number(document.getElementById(row.toString() + col.toString()).textContent);
}

export function puzzleStatus() {
    var filled = 0;
    for (var i = 0; i < 81; i++) if (document.querySelectorAll("td")[i].textContent === "") filled++;
    if (filled === 0) {
        for (var row = 0; row < solvedPuzzle.length; row++) {
            for (var col = 0; col < solvedPuzzle.length; col++) {
                if (solvedPuzzle[row][col] !== puzzleTracker.board[row][col] && puzzleTracker.board[row][col] !== 0) {
                    document.querySelector("input[name=tick]").checked = true;
                    showErrors();
                    return;
                }
                else if (row === 8 && col === 8) {
                    document.body.style.backgroundColor = "#98fb98";
                    for (var i = 0; i < 81; i++) document.querySelectorAll(".cell")[i].classList.add("cell-success");
                }
            }
        }
    }
}

export function generateGrid() {
    var tBody = document.querySelector("#tableBody");
    var html = "<tr>";
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) html = html + '<td class="cell" id="' + row + col + '"></td>';
        html = html + "</tr>";
    }
    tBody.innerHTML = html;
}

export function showErrors() {
    if (document.querySelector("input[name=tick]").checked) {
        for (var row = 0; row < solvedPuzzle.length; row++) {
            for (var col = 0; col < solvedPuzzle.length; col++) {
                if (solvedPuzzle[row][col] !== puzzleTracker.board[row][col] && puzzleTracker.board[row][col] !== 0)
                    document.getElementById(row.toString() + col.toString()).classList.add("error");
                else document.getElementById(row.toString() + col.toString()).classList.remove("error");
            }
        }
    } else if (document.querySelectorAll(".error")[0])
        while (document.getElementsByClassName("error").length > 0) document.getElementsByClassName("error")[0].classList.remove("error");
}

export async function fillPuzzle(data) {
    clearGrid();
    document.getElementById("message").textContent = "Generating Sudoku...";
    while (document.querySelectorAll(".non-edit").length > 0)
        document.querySelectorAll(".non-edit")[0].classList.remove("non-edit");
    for (var i = 0; i < data.squares.length; i++) {
        document.getElementById(data.squares[i].x.toString() + data.squares[i].y.toString()).textContent = data.squares[i].value;
        document.getElementById(data.squares[i].x.toString() + data.squares[i].y.toString()).classList.add("non-edit");
    }
    objectStructureDefine();
}

export function showSolution(row, col, animation) {
    document.body.style.backgroundColor = "#98fb98";
    for (let i = 0; i < document.querySelectorAll("td").length; i++)
        document.querySelectorAll("td")[i].classList.add("cell-success");
    window.clearInterval(animation);
    document.getElementById(row.toString() + col.toString()).textContent = solvedPuzzle[row][col];
    document.querySelector("body").removeEventListener("keydown", keyboardControls);
    for (let i = 0; i < document.querySelectorAll(".buttons button").length; i++)
        document.querySelectorAll(".buttons button")[i].removeEventListener("click", btnClick);
}

export function determineLevel() {
    var level, levelText = document.querySelector("#navbarDropdown").textContent;
    if (levelText === "Easy") level = 1;
    else if (levelText === "Medium") level = 2;
    else level = 3;
    return level;
}

function objectStructureDefine() {
    for (var row = 0; row < puzzleTracker.board.length; row++) {
        for (var col = 0; col < puzzleTracker.board.length; col++) {
            if (document.getElementById(row.toString() + col.toString()).textContent === "")
                puzzleTracker.board[row].push(0);
            else puzzleTracker.board[row].push(Number(document.getElementById(row.toString() + col.toString()).textContent));
        }
    }
}

function clearGrid() {
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            document.getElementById(i.toString() + j.toString()).textContent = "";
}