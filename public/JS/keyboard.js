import { puzzleUpdate, showErrors, puzzleStatus } from './sudoku.js';
export function keyboardControls(e) {
    if (document.querySelector(".focus")) {
        if (e.keyCode === 49 || e.keyCode === 97) {
            document.querySelector(".focus").textContent = 1;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 50 || e.keyCode === 98) {
            document.querySelector(".focus").textContent = 2;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 51 || e.keyCode === 99) {
            document.querySelector(".focus").textContent = 3;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 52 || e.keyCode === 100) {
            document.querySelector(".focus").textContent = 4;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 53 || e.keyCode === 101) {
            document.querySelector(".focus").textContent = 5;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 54 || e.keyCode === 102) {
            document.querySelector(".focus").textContent = 6;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 55 || e.keyCode === 103) {
            document.querySelector(".focus").textContent = 7;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 56 || e.keyCode === 104) {
            document.querySelector(".focus").textContent = 8;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 57 || e.keyCode === 105) {
            document.querySelector(".focus").textContent = 9;
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else if (e.keyCode === 46 || e.keyCode === 8) {
            document.querySelector(".focus").textContent = "";
            puzzleUpdate();
            showErrors();
            puzzleStatus();
        } else {
            if (document.activeElement === document.body) {
                document.body.style.backgroundColor = "#DC3545";
                setTimeout(() => document.body.style.backgroundColor = "#FFE", 500);
            }
        }
    }
}