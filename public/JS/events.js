import { puzzleStatus, showErrors, puzzleUpdate } from './sudoku.js';
import { newGame } from './main.js';
import { keyboardControls } from './keyboard.js';

export function changeLevel() {
    for (var i = 0; i < 3; i++) {
        document.querySelectorAll(".dropdown-menu a")[i].addEventListener("click", function (e) {
            e.stopImmediatePropagation();
            document.querySelector("#navbarDropdown").textContent = this.textContent;
            newGame();
        });
    }
}

export function triggerFocus() {
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

export function editCellContent() {
    for (var i = 0; i < document.querySelectorAll(".buttons button").length; i++) {
        document.querySelectorAll(".buttons button")[i].addEventListener("click", btnClick);
        document.querySelector("body").addEventListener("keydown", keyboardControls);
    }
}

export function btnClick() {
    if (document.querySelector(".focus")) {
        document.querySelector(".focus").textContent = this.textContent;
        puzzleUpdate();
        showErrors();
    }
    puzzleStatus();
}