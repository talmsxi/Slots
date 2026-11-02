const symbols = ['seven', 'cherry', 'lemon', 'melon', 'grape', 'bell'];

const reels = 3;
const rows = 3;
const maxAttempts = 3;

let attempt = 0;
let spinning = false;
let gameOver = false;

window.onload = askName;

function askName() {
    let name = prompt('Як вас звати?');

    while (name != null && name.trim() == '') {
        name = prompt('Ім\'я не може бути порожнім. Як вас звати?');
    }

    if (name == null) {
        name = 'USER';
    }

    document.getElementById('playerName').innerHTML = name.toUpperCase();
}

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function alreadyInColumn(column, name) {
    for (let i = 0; i < column.length; i = i + 1) {
        if (column[i] == name) {
            return true;
        }
    }
    return false;
}

function makeColumn() {
    let column = [];

    while (column.length < rows) {
        let name = randomSymbol();

        if (alreadyInColumn(column, name) == false) {
            column[column.length] = name;
        }
    }

    return column;
}

function showColumn(reelNumber, column) {
    let reel = document.getElementById('reel' + reelNumber);

    for (let i = 0; i < rows; i = i + 1) {
        reel.children[i].children[0].src = 'img/' + column[i] + '.png';
    }
}

function setRolling(reelNumber, on) {
    let reel = document.getElementById('reel' + reelNumber);

    for (let i = 0; i < rows; i = i + 1) {
        if (on) {
            reel.children[i].classList.add('rolling');
        }
        else {
            reel.children[i].classList.remove('rolling');
        }
    }
}

function clearHighlight() {
    for (let r = 0; r < reels; r = r + 1) {
        let reel = document.getElementById('reel' + r);

        for (let i = 0; i < rows; i = i + 1) {
            reel.children[i].classList.remove('win');
        }
    }

    document.getElementById('machine').classList.remove('jackpot');
}

function highlightRow(row) {
    for (let r = 0; r < reels; r = r + 1) {
        document.getElementById('reel' + r).children[row].classList.add('win');
    }

    document.getElementById('machine').classList.add('jackpot');
}

function findWinRow(table) {
    for (let row = 0; row < rows; row = row + 1) {
        if (table[0][row] == table[1][row] && table[1][row] == table[2][row]) {
            return row;
        }
    }
    return -1;
}

function showResult(text, style) {
    let box = document.createElement('div');
    box.classList.add('result-box');
    box.classList.add(style);
    box.innerHTML = text;

    let place = document.getElementById('result');
    place.innerHTML = '';
    place.appendChild(box);
}

function spin() {
    if (gameOver) {
        newGame();
        return;
    }

    if (spinning) {
        return;
    }

    spinning = true;
    attempt = attempt + 1;
    clearHighlight();

    document.getElementById('attempts').innerHTML = 'Спроба ' + attempt + ' з ' + maxAttempts;
    document.getElementById('spinButton').classList.add('off');
    showResult('Барабани крутяться...', 'wait-text');

    let lever = document.getElementById('lever');
    lever.classList.add('pulled');
    setTimeout(function () {
        lever.classList.remove('pulled');
    }, 400);

    let table = [makeColumn(), makeColumn(), makeColumn()];

    spinReel(0, table[0], 900);
    spinReel(1, table[1], 1400);
    spinReel(2, table[2], 1900);

    setTimeout(function () {
        checkResult(table);
    }, 2000);
}

function spinReel(reelNumber, column, delay) {
    setRolling(reelNumber, true);

    let timer = setInterval(function () {
        showColumn(reelNumber, makeColumn());
    }, 110);

    setTimeout(function () {
        clearInterval(timer);
        setRolling(reelNumber, false);
        showColumn(reelNumber, column);
    }, delay);
}

function checkResult(table) {
    spinning = false;

    let row = findWinRow(table);

    if (row != -1) {
        highlightRow(row);
        dropCoins();
        showResult('ДЖЕКПОТ! Ви виграли', 'win-text');
        finishGame();
    }
    else if (attempt == maxAttempts) {
        showResult('Спроби вичерпано. Ви програли', 'lose-text');
        finishGame();
    }
    else {
        showResult('Ряду не склалось. Спробуйте ще', 'wait-text');
        document.getElementById('spinButton').classList.remove('off');
    }
}

function dropCoins() {
    for (let i = 0; i < 26; i = i + 1) {
        let coin = document.createElement('div');
        coin.classList.add('coin');
        coin.style.left = Math.floor(Math.random() * 100) + '%';
        coin.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
        coin.style.animationDelay = (Math.random() * 0.9) + 's';
        document.body.appendChild(coin);

        setTimeout(function () {
            coin.remove();
        }, 4500);
    }
}

function finishGame() {
    gameOver = true;
    document.getElementById('spinButton').innerHTML = 'НОВА ГРА';
    document.getElementById('spinButton').classList.remove('off');
}

function newGame() {
    attempt = 0;
    gameOver = false;
    spinning = false;

    clearHighlight();
    document.getElementById('attempts').innerHTML = 'Спроба 0 з ' + maxAttempts;
    document.getElementById('result').innerHTML = '';
    document.getElementById('spinButton').innerHTML = 'КРУТИТИ';

    for (let r = 0; r < reels; r = r + 1) {
        showColumn(r, makeColumn());
    }
}
