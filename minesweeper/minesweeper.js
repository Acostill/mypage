var tbody = document.querySelector('tbody');
var table = document.querySelector('table');
var h2    = document.querySelector('h2');
var start = true
var numColors = [null, 'blue', 'green', 'red', 'purple', 'darkred', 'white', 'white', 'white']
var mines      = 3;
var boardRow   = 4;
var boardCol   = 4;
var board      = makeBoard(boardRow, boardCol);
var gameOver   = false;
var unrevealed = boardRow * boardCol;

function Cell (row, column) {
    // this.position  = [row, column];
    this.row       = row;
    this.column    = column;
    this.hasMine   = false;
    this.nearMine  = 0;
    this.revealed  = false;
    this.flagged   = false;
    this.locked    = false;
    this.display   = '';
    this.htmlEl    = table.children[row].children[column];
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

        cell.display = 'M';
        cell.htmlEl.style.color = 'black';
        cell.hasMine = true;
        cell.locked  = true;
        minesLeft--;
    }
}

function setNums() {
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[r].length; c++) {
            var cell = board[r][c];
            cell.nearMine = adjCells(cell).filter(function(cell) {
                return cell.hasMine;
            }).length;

            if (!cell.hasMine && cell.nearMine !== 0) {
                cell.htmlEl.style.color = numColors[cell.nearMine];
                cell.display = cell.nearMine;
            }
        }
    }
}

function reveal(cell, recursive) {
    cell.htmlEl.style.backgroundColor = '#E0D2AF';
    cell.htmlEl.innerText = cell.display;
    cell.revealed = true;

    if (!cell.nearMine && recursive === 'recursive')  {
        var neighbors = adjCells(cell);
        for (var i = 0; i < neighbors.length; i++) {
            neighbors[i].htmlEl.style.backgroundColor = '#E0D2AF';
            neighbors[i].htmlEl.innerText = neighbors[i].display;
            // unrevealed--;
            if (!neighbors[i].nearMine && 
                !neighbors[i].revealed) {
                    reveal(neighbors[i], 'recursive');
            }
        }
    }
}
console.log(tbody);
table.addEventListener('click', function (event) {
    var cell;
    if (gameOver) {
        return
    }

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
    reveal(cell, 'recursive')
    if (cell.hasMine) {
        gameOver = true;
        console.log('test');
        for (var r = 0; r < board.length; r++) {
            for (var c = 0; c < board[r].length; c++) {
                if (board[r][c].hasMine) {
                    reveal(board[r][c]);
                }
                
            }
        }
        cell.htmlEl.style.backgroundColor = 'red';
        h2.innerText = 'Game Over';
    }
    console.log('Unrevealed cells: ' + unrevealed);
    if (unrevealed === mines) {
        gameOver = true;
        h2.innerHTML = 'Victory';
    }
});