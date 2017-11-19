var tbody = document.querySelector('tbody');
var table = document.querySelector('table');
var h2    = document.querySelector('h2');
var start = true
var numColors = [null, 'blue', 'green', 'red', 'purple', 'darkred', '#007B7B', 'brown', 'grey']
var mines      = 99;
var boardRow   = 16;
var boardCol   = 30;
var board      = makeBoard(boardRow, boardCol);
var gameOver   = false;
// var unrevealed = boardRow * boardCol;

function Cell (row, column) {
    // this.position  = [row, column];
    this.row       = row;
    this.column    = column;
    this.hasMine   = false;
    this.nearMine  = 0;
    this.revealed  = false;
    // this.flagged   = false;
    // this.qMarked   = false;
    this.locked    = false;
    this.marked    = '';
    this.display   = '';
    this.htmlEl    = table.children[row].children[column];

    this.reveal    = (arg) => {

        if (this.marked) {
            return;
        }

        this.htmlEl.innerHTML = this.display;
        this.htmlEl.style.backgroundColor = '#fff';
        this.revealed = true;

        if (!this.nearMine && arg === 'recursive')  {
            var neighbors = adjCells(this);
            for (var i = 0; i < neighbors.length; i++) {
                
                if (!neighbors[i].revealed) {
                    neighbors[i].reveal();
                    if (!neighbors[i].nearMine) {
                        neighbors[i].reveal('recursive');
                    }
                }
            }
        }
    }

    this.getNum   = () => {
        this.nearMine = adjCells(this).filter(el => el.hasMine).length;

        if (!this.hasMine && this.nearMine !== 0) {
            this.htmlEl.style.color = numColors[this.nearMine];
            this.display = this.nearMine;
        }
    }
    this.setFlag  = () => {
        // this.flagged = true;
        if (this.revealed) {
            return;
        }
        this.marked  = '&#x2691';
        this.htmlEl.innerHTML = this.marked;
        this.htmlEl.style.color = '#ded2b3';
    }
    this.removeIndicators = () => {
        this.marked  = '';
        this.htmlEl.innerHTML = this.marked;
        this.getNum();
    }
}

function makeBoard(rows, columns) {
    var result = [];
    for (var r = 0; r < rows; r++) {
        var tr = document.createElement('tr');
        for (var c = 0; c < columns; c++) {
            tr.appendChild(document.createElement('td'));
        }
        table.appendChild(tr);
    }

    tbody = table;
    console.log(tbody)
    for (var r = 0; r < rows; r++) {
        var boardRow = [];
        for (var c = 0; c < columns; c++) {
            boardRow.push(new Cell(r, c));
        }
        result.push(boardRow);
    }
    return result;
}

function adjCells(cell) {
    result = [ 
        [-1, -1], [-1, 0], [-1, +1], 
        [0, -1],            [0, +1], 
        [+1, -1], [+1, 0], [+1, +1] 
    ]
    .map(function (position) {
        try {
            return board[cell.row + position[0]][cell.column + position[1]];    
        } catch (e) {
            // Screw these errors... do nothing
        }
    }, 0)
    .filter(function (index) {
        return index !== undefined;
    })
    return result;
}

function lockCells(cell) {
    cell.locked = true;
    var neighbors = adjCells(cell);
    for (var i = 0; i < neighbors.length; i++) {
        neighbors[i].locked = true;
    }
}

function setMines(event) {
    var rows = board.length;
    var columns = board[0].length;
    var minesLeft = mines;
    while (minesLeft > 0) {
        var row = Math.floor(Math.random() * rows);
        var column = Math.floor(Math.random() * columns);
        var cell = board[row][column];
        if (cell.locked) {
            continue;
        }

        cell.display = '&#x1F4A3';
        cell.htmlEl.style.color = 'black';
        cell.hasMine = true;
        cell.locked  = true;
        minesLeft--;
    }
}

function setNums() {
    board.forEach(row => {
        row.forEach(cell => cell.getNum());
    })
}

function reveal(cell, recursive) {
    if (cell.revealed) {
        return
    }
    cell.reveal();
}
function endGame(cell, str) {
    gameOver = true;
    if (str === 'loss') {
        for (var r = 0; r < board.length; r++) {
            board[r].forEach(el => el.hasMine ? reveal(el):null)

        }
        cell.htmlEl.style.backgroundColor = 'red';
        h2.innerHTML = 'Game Over';        
    }

}
table.addEventListener('click', (event) => {
    if (gameOver) {
        return
    }
    var cell;
    for (var row = 0; row < board.length; row++) {
        var foundCell = board[row].filter(function (cell) {
            console.log(cell.htmlEl === event.target);
            return cell.htmlEl === event.target;
        })[0];
        if (foundCell) {
            cell = foundCell;
            break;
        }
    }

    if (start) {
        lockCells(cell);
        setMines(event);
        setNums();
        start = false;
    }

    //End game as loss if mine is clicked
    if (cell.hasMine && cell.marked !== '&#x2691') {
        endGame(cell, 'loss');
    } else {
        cell.reveal('recursive');
    }

    let unrevealed = 0;
    board.forEach(row => {
        row.forEach(cell => cell.revealed ? null : unrevealed++)
    })
    
    //End game as victory if only cells left are mines
    console.log('Unrevealed cells: ' + unrevealed);
    if (unrevealed === mines) {
        gameOver = true;
        h2.innerHTML = 'Victory';

        for (var r = 0; r < board.length; r++) {
            board[r].forEach(el => el.hasMine ? el.setFlag():null)

        }

    }
});

table.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (gameOver) {
        return;
    }
    var cell;
    for (var row = 0; row < board.length; row++) {
        var foundCell = board[row].filter(function (cell) {
            console.log(cell.htmlEl === event.target);
            return cell.htmlEl === event.target;
        })[0];
        if (foundCell) {
            cell = foundCell;
            break;
        }
    }
    if (cell.revealed && cell.nearMine) {
        var neighbors = adjCells(cell);
        var markedNeighbors = neighbors.filter(el => el.marked === '&#x2691');

        if (markedNeighbors.length === cell.nearMine) {
            neighbors.forEach(el => {
                if (el.hasMine && el.marked !== '&#x2691') {
                    endGame(el, 'loss');
                    return;
                }
                el.reveal('recursive')
            });
        }
    } else {
        switch (cell.marked) {
            case '':
                cell.setFlag();
                break;
            case '&#x2691':
                cell.removeIndicators()
                break;
        }        
    }
    let unrevealed = 0;
    board.forEach(row => {
        row.forEach(cell => cell.revealed ? null : unrevealed++)
    })
    
    //End game as victory if only cells left are mines
    console.log('Unrevealed cells: ' + unrevealed);
    if (unrevealed === mines) {
        gameOver = true;
        h2.innerHTML = 'Victory';

        for (var r = 0; r < board.length; r++) {
            board[r].forEach(el => el.hasMine ? el.setFlag():null)

        }

    }

})