import { realDictionary } from "./dictionary.js";
const dictionary=realDictionary;
const dict_correct={0:"Genius",1:"Magnificent",2:"Impressive",3:"Splendid",4:"Great",5:"Phew"};
//////////////////////////////////

function frequency_counter(word) {
    let freq_array = Array(26).fill(0);
    for (let i = 0; i < 5; i++) {
        freq_array[word[i].codePointAt() - 97]++;
    }
    return freq_array;
}

//state stores the current state of the game, along with certain useful flags
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currRow: 0,
    currCol: 0,
    maxRow:6,
    secret_count: null,
    running: true
};
state.secret_count = frequency_counter(state.secret);
console.log(state.secret);

function updateGrid() {
    for (let i = state.currRow; i < state.maxRow; i++) {
        for (let j = 0; j < 5; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

//created this function to handle the issue which occurs where the plop animation is still part of the box when updating it upon pressing enter on a valid word
function updateGrid_2() {
    for (let i = state.currRow; i < state.maxRow; i++) {
        for (let j = 0; j < 5; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.classList.remove('plop');
            box.textContent = state.grid[i][j];
        }
    }
}


function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;
    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < state.maxRow; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function isLetter(key) {
    return key.match(/[a-z]/) && key.length === 1;
}

function getCurrentWord() {
    const word = state.grid[state.currRow].slice(0, 5).join('');
    return word;
}

function isValidWord(word) {
    return dictionary.includes(word);
}

function addLetter(letter) {
    if (state.currCol === 5) return false;
    state.grid[state.currRow][state.currCol] = letter;
    const box=document.getElementById(`box${state.currRow}${state.currCol}`);
    box.style.border= "2px solid #565758";
    box.classList.add('plop');
    state.currCol++;
    return true;
}

function removeLetter() {
    if (state.currCol === 0) return;
    state.grid[state.currRow][state.currCol - 1] = '';
    const box=document.getElementById(`box${state.currRow}${state.currCol-1}`);
    box.style.border= "2px solid #3a3a3c";
    box.classList.remove('plop');
    state.currCol--;
}

function revealWord(guess) {
    let secret_freq = state.secret_count.slice();
    const row = state.currRow;
    const animation_duration = 500; //ms
    let state_word = Array(5).fill(false); // 0: wrong, 1: correct

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        box.classList.remove('plop');
        const letter = box.textContent;
        if (letter === state.secret[i]) {
            state_word[i] = true;
            secret_freq[letter.codePointAt() - 97] -= 1;
        }
    }

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        setTimeout(() => {
            if (state_word[i]) {
                box.classList.add('right');
                box.style.border="2px solid #538d4e";
            }
            else
            {
            if (secret_freq[letter.codePointAt() - 97] > 0) {
                box.classList.add('partial');
                box.style.border="2px solid #b59f3b";
                secret_freq[letter.codePointAt() - 97]--;
            } else {
                box.classList.add('empty');
                box.style.border="2px solid #3a3a3c";
            }
        }
        }, ((i + 1) * animation_duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    setTimeout(() => {
        const message = document.getElementById('message');
        if (state.secret === guess) {
            message.innerHTML =dict_correct[state.currRow-1];
            message.classList.add('display');
            state.running=false;
        } else if (state.currRow === state.maxRow) {
            message.innerHTML = `The word was ${state.secret}`;
            message.classList.add('display');
        }
    }, 3 * animation_duration);
}

//adds the jiggle animation when the word is not accepted
function incorrect_animate(text){
    const message=document.getElementById('message');
    message.innerHTML =text;
    message.classList.add('display');
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${state.currRow}${i}`);
        box.classList.add('jiggle');
    }
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            const box = document.getElementById(`box${state.currRow}${i}`);
            box.classList.remove('jiggle');
        }
    }, 400);
    updateGrid_2();
    setTimeout(() => {
        message.classList.remove('display');
    }, 2000);
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (!state.running) return;
        if (isLetter(key)) {
            if(addLetter(key)) updateGrid();
        }
        if (key === 'Backspace') {
            removeLetter();
            updateGrid();
        }
        if (key === 'Enter') {
            if (state.currCol !== 5) 
            {
                incorrect_animate("Not enough letters");
                return;
            }
            const word = getCurrentWord();
            if(!isValidWord(word))
            {
                incorrect_animate("Not a valid word");
                return;
            }
            revealWord(word);
            state.currRow++;
            state.currCol = 0;
        }
    };
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
}

function reset(){
    const game = document.getElementById('game');
    message.innerHTML = `The word was ${state.secret}`;
    message.classList.add('display');
    setTimeout(() => {
        message.classList.remove('display');
    }, 2000);
    game.innerHTML=''; //deletes the entire game
    state.secret= dictionary[Math.floor(Math.random() * dictionary.length)]; //resetting the entire game state
    state.grid= Array(6).fill().map(() => Array(5).fill(''));
    state.currRow= 0;
    state.currCol= 0;
    state.maxRow=6;
    state.secret_count= frequency_counter(state.secret);
    state.running= true;
    console.log(state.secret);
    drawGrid(game);
    registerKeyboardEvents();
    
}
startup();
window.reset=reset;
