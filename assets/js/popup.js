let canvas, context;

let gameStarted = false;
let paused = false;

let start = false;
let SpeederCost = 2;
let PFgold = 5;
let InvinciC = 10;
let Icharge = 0;
let score = 0;
let sCount = 0;

let startS = 5;

let speedOfSnake = 5;
let originalSpeed = speedOfSnake;

let gold = 0;
let goldCount = 0;

let grid = 16;
let count = 0;

let lastSave = 0;

const MAX_SNAKE_LENGTH = 1000;

let snake, invincible, apple, goldO, portalIN, portalOut, Speeder, invi;

function init() {
	canvas = document.getElementById('game');
	if (!canvas) return;

	context = canvas.getContext('2d');

	reset(false);

	loadGame(() => {
		drawStartScreen();
		requestAnimationFrame(loop);
	});
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function drawCenteredText(text, y, size, color) {
	context.fillStyle = color;
	context.font = size + "px Arial";
	context.textAlign = "center";
	context.fillText(text, canvas.width / 2, y);
}

function drawStartScreen() {
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawCenteredText("SNAKE", 140, 40, "lime");
	drawCenteredText("Press ENTER to Start", 210, 24, "white");
}

function drawPauseMenu() {
	context.fillStyle = "rgba(0,0,0,0.7)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawCenteredText("PAUSED", 180, 40, "yellow");
	drawCenteredText("Press P to Resume", 230, 24, "white");
}

function saveGame() {
	chrome.storage.local.set({
		saveData: {
			gameStarted,
			paused,
			start,
			SpeederCost,
			PFgold,
			InvinciC,
			Icharge,
			score,
			sCount,
			startS,
			speedOfSnake,
			originalSpeed,
			gold,
			goldCount,
			count,
			snake,
			invincible,
			apple,
			goldO,
			portalIN,
			portalOut,
			Speeder,
			invi
		}
	});
}

function loadGame(callback) {
	chrome.storage.local.get(['saveData'], (data) => {
		if (data.saveData) {
			Object.assign(window, data.saveData);
		}
		if (callback) callback();
	});
}

function reset(deleteSavedGame = true) {
	snake = {
		x: grid * 10,
		y: grid * 10,
		sx: grid - 1,
		sy: grid - 1,
		dx: grid,
		dy: 0,
		cells: [],
		maxCells: startS
	};

	invincible = { is: false, frames: 0 };

	apple = randObj();
	goldO = randObj();
	portalIN = randObj();
	portalOut = randObj();
	Speeder = randObj();
	invi = randObj();

	score = 0;
	sCount = 0;
	gold = 0;
	goldCount = 0;
}

function randObj() {
	return {
		x: getRandomInt(0, canvas.width / grid) * grid,
		y: getRandomInt(0, canvas.height / grid) * grid,
		sx: grid - 1,
		sy: grid - 1
	};
}

function loop() {
	requestAnimationFrame(loop);

	if (!canvas || !context) return;

	if (!gameStarted) {
		drawStartScreen();
		return;
	}

	if (paused) {
		drawPauseMenu();
		return;
	}

	if (++count < speedOfSnake) return;
	count = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);

	snake.x += snake.dx;
	snake.y += snake.dy;

	if (snake.x < 0) snake.x = canvas.width - grid;
	else if (snake.x >= canvas.width) snake.x = 0;

	if (snake.y < 0) snake.y = canvas.height - grid;
	else if (snake.y >= canvas.height) snake.y = 0;

	snake.cells.unshift({ x: snake.x, y: snake.y });

	while (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}

	context.fillStyle = 'red';
	context.fillRect(apple.x, apple.y, apple.sx, apple.sy);

	context.fillStyle = 'green';

	snake.cells.forEach((cell, index) => {
		context.fillRect(cell.x, cell.y, snake.sx, snake.sy);

		if (cell.x === apple.x && cell.y === apple.y) {
			score++;
			sCount++;

			apple = randObj();
		}

		for (let i = index + 1; i < snake.cells.length; i++) {
			if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
				reset(false);
			}
		}
	});

	const board = document.getElementById("ScoreBoard");
	if (board) {
		board.innerHTML = `Score: ${score} Gold: ${goldCount}`;
	}

	if (Date.now() - lastSave > 2000) {
		saveGame();
		lastSave = Date.now();
	}
}

document.addEventListener('keydown', (e) => {
	if (e.which === 13 && !gameStarted) {
		gameStarted = true;
		return;
	}

	if (e.which === 80) {
		paused = !paused;
		return;
	}

	if (e.which === 82) {
		reset();
		return;
	}

	if (!gameStarted || paused) return;

	if (e.which === 37 && snake.dx === 0) {
		snake.dx = -grid; snake.dy = 0;
	}
	else if (e.which === 38 && snake.dy === 0) {
		snake.dy = -grid; snake.dx = 0;
	}
	else if (e.which === 39 && snake.dx === 0) {
		snake.dx = grid; snake.dy = 0;
	}
	else if (e.which === 40 && snake.dy === 0) {
		snake.dy = grid; snake.dx = 0;
	}
});

window.onload = init;