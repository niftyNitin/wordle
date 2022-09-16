const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');
const wordle = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<',
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

// function to create the tiles and keys dynamically
guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach(function (guess, guessIndex) {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.setAttribute('class', 'tile');
        rowElement.append(tileElement);
    });
    tileDisplay.append(rowElement);
});

keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', function () {
        return handleKey(key);
    });
    keyboard.append(buttonElement);
});

// function to handle the key pressed or clicked from virtual keyboard
const handleKey = (key) => {
    if (isGameOver) {
        let newGame = confirm("Do you want to play again?");
        if (newGame) {
            window.location.reload();
        }
        else {
            return;
        }
    }

    if (key == '<<') {
        deleteLetter();
        return;
    }
    if (key == 'ENTER') {
        checkRow();
        return;
    }
    addLetter(key);
}

// function to add the letter to the tile of current row
const addLetter = (key) => {
    if (currentRow > 5 || currentTile > 4) {
        return;
    }
    if (currentTile < 0) currentTile = 0;
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = key;
    guessRows[currentRow][currentTile] = key;
    tile.setAttribute('data', key);
    currentTile++;
}

// function to delete the letter from the tile
const deleteLetter = () => {
    if (currentTile <= 0) {
        return;
    }
    if (currentTile > 5) currentTile = 5;
    currentTile--;
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = '';
    tile.setAttribute('data', '');
}

// function to check if the word is in the wordlist and if the word is found, end the game
const checkRow = () => {
    if (currentTile === 5) {
        const row = guessRows[currentRow];
        const rowString = row.join('');
        if (!wordList.includes(rowString.toLowerCase())) {
            showMessage('Word not found!');
            return;
        }
        flipTile();
        if (rowString == wordle) {
            showMessage('Magnificent!');
            isGameOver = true;
        }
        else {
            if (currentRow >= 5) {
                showMessage('Game Over. Wordle was ' + wordle);
                isGameOver = true;
                return;
            }
            else {
                currentRow++;
                currentTile = 0;
            }
        }
    }
}

// function to display the message "Word not found" or "Game Over" or "Magnificent"
const showMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.append(messageElement);

    setTimeout(() => {
        messageDisplay.removeChild(messageElement);
    }, 2000);
}

// function to flip the tile after submitting a row and add color to the tiles and keys
const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' });
    });

    guess.forEach((guess) => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    });
    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(wordle[index], '');
        }
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);
        }, 500 * index);
    });
}

// function to add style to the keys in the keyboard after submitting a row
const addColorToKey = (key, color) => {
    const keyElement = document.getElementById(key);
    if (keyElement.classList.contains('green-overlay')) {
        return;
    }
    keyElement.classList.add(color);
}

// function to play game from keyboard and handle keypress
document.addEventListener('keydown', (event) => {
    let name = event.key.toUpperCase();
    if (name == 'BACKSPACE') {
        name = '<<';
    }
    if (keys.includes(name)) {
        handleKey(name);
    }
    else {
        return;
    }
}, false);
