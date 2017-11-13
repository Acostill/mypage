// Global variables
/** */
var tbody = document.querySelector('tbody');
var displayCurrent = document.querySelector('#current')
var displayCurrentName = document.querySelector('#current-player');
var displayCurrentChar = document.querySelector('#current-char');
var displayWinner = document.querySelector('#winner');
var gameOver = false;
var turn = 1;
var board = [
    [(tbody.children[0].children[0]), (tbody.children[0].children[1]), (tbody.children[0].children[2])],
    [(tbody.children[1].children[0]), (tbody.children[1].children[1]), (tbody.children[1].children[2])],
    [(tbody.children[2].children[0]), (tbody.children[2].children[1]), (tbody.children[2].children[2])]
];
var player1 = {
    name: 'Player 1',
    char: 'X'
}
var player2 = {
    name: 'Player 2',
    char: 'O'
}
var currentPlayer = player1;
function togglePlayer() {
    if (currentPlayer === player1) {
        currentPlayer = player2;
        displayCurrentName.innerText = currentPlayer.name;
        displayCurrentChar.innerText = currentPlayer.char;
    } else {
        currentPlayer = player1
        displayCurrentName.innerText = currentPlayer.name;
        displayCurrentChar.innerText = currentPlayer.char;
    }
}

//Returns true if three in a row
function checkRows (player) {
    if (board[0][0].innerText === player.char &&
        board[0][1].innerText === player.char &&
        board[0][2].innerText === player.char) {
            return true;
    }
    if (board[1][0].innerText === player.char &&
        board[1][1].innerText === player.char &&
        board[1][2].innerText === player.char) {
            return true;
    }
    if (board[2][0].innerText === player.char &&
        board[2][1].innerText === player.char &&
        board[2][2].innerText === player.char) {
            return true;
    }
}

//Returns true if three in a column
function checkColumns (player) {
    if (board[0][0].innerText === player.char &&
        board[1][0].innerText === player.char &&
        board[2][0].innerText === player.char) {
            return true;
    }
    if (board[0][1].innerText === player.char &&
        board[1][1].innerText === player.char &&
        board[2][1].innerText === player.char) {
            return true;
    }
    if (board[0][2].innerText === player.char &&
        board[1][2].innerText === player.char &&
        board[2][2].innerText === player.char) {
            return true;
    }
}

//Returns true if three in a diagonal
function checkDiagonals (player) {
    if (board[0][0].innerText === player.char &&
        board[1][1].innerText === player.char &&
        board[2][2].innerText === player.char) {
            return true;
    }
    if (board[0][2].innerText === player.char &&
        board[1][1].innerText === player.char &&
        board[2][0].innerText === player.char) {
            return true;
    }
}

function isWinner(player) {
    return checkRows(player)? true : 
           checkColumns(player)? true : 
           checkDiagonals(player)? true : false;

}

function isDraw() {
    if (turn === 9 && !isWinner(currentPlayer)) {
        return true
    }
}

function endGame (status, player) {
    if (status === 'win') {
        displayCurrent.innerText = player.name + ' wins!';
    } else if (status === 'draw') {
        displayCurrent.innerText = 'The game is a draw';
    }
    gameOver = true;
}

//Runs code everytime a cell in the table is clicked
tbody.addEventListener('click', function (event) {
    if (gameOver) {
        return;
    }
    if (event.target.innerText) {
        return;
    }
    event.target.innerText = currentPlayer.char;
    if (isWinner(currentPlayer)) {
        endGame('win', currentPlayer);
        return;
    }
    if (isDraw()) {
        endGame('draw', currentPlayer);
        return;
    }
    togglePlayer();
    turn++;
    console.log(turn);
});

/*
[
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
 */