const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;

const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
];

let currentShape;
let currentPosition;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'blue';
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function drawShape() {
    currentShape.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'red';
                context.fillRect((currentPosition.x + x) * BLOCK_SIZE, (currentPosition.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect((currentPosition.x + x) * BLOCK_SIZE, (currentPosition.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function mergeShape() {
    currentShape.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPosition.y + y][currentPosition.x + x] = 1;
            }
        });
    });
}

function removeFullRows() {
    board = board.filter(row => row.some(value => value === 0));
    const rowsRemoved = ROWS - board.length;
    score += rowsRemoved * 100;
    scoreDisplay.innerText = `Score: ${score}`;
    while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
    }
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;
    spawnShape();
}

function spawnShape() {
    const randomIndex = Math.floor(Math.random() * shapes.length);
    currentShape = { shape: shapes[randomIndex] };
    currentPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };

    if (collision()) {
        alert('Game Over!');
        resetGame();
    }
}

function collision() {
    return currentShape.shape.some((row, y) => {
        return row.some((value, x) => {
            if (value) {
                const newX = currentPosition.x + x;
                const newY = currentPosition.y + y;
                return newX < 0 || newX >= COLS || newY >= ROWS || board[newY] && board[newY][newX];
            }
            return false;
        });
    });
}

function moveShape(direction) {
    currentPosition.x += direction;
    if (collision()) {
        currentPosition.x -= direction;
    }
}

function rotateShape() {
    const originalShape = currentShape.shape;
    currentShape.shape = currentShape.shape[0].map((_, index) => currentShape.shape.map(row => row[index]).reverse());
    if (collision()) {
        currentShape.shape = originalShape;
    }
}

function dropShape() {
    currentPosition.y++;
    if (collision()) {
        currentPosition.y--;
        mergeShape();
        removeFullRows();
        spawnShape();
    }
}

function update() {
    drawBoard();
    drawShape();
    dropShape();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveShape(-1);
    } else if (event.key === 'ArrowRight') {
        moveShape(1);
    } else if (event.key === 'ArrowUp') {
        rotateShape();
    } else if (event.key === 'ArrowDown') {
        dropShape();
    }
});

resetGame();
setInterval(update, 1000);