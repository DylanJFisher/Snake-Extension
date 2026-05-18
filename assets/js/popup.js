var game = createDefaultGame();

function createDefaultGame() {
	return {
		canvas: document.getElementById('game'),
		context: document.getElementById('game').getContext('2d'),

		gameStarted: false,
		paused: false,

		start: false,
		SpeederCost: 2,
		PFgold: 5,
		InvinciC: 10,
		Icharge: 0,
		score: 0,
		sCount: 0,

		startS: 5,

		speedOfSnake: 5,
		originalSpeed: 5,

		gold: 0,
		goldCount: 0,

		grid: 16,
		count: 0,

		MAX_SNAKE_LENGTH: 0,

		PortalColorIn: ['blue', 'purple', 'cyan', 'gray'],
		PortalColorOut: ['orange', 'cyan', 'purple', 'grey'],
		SpeederColor: ['black', 'white', 'black', 'white'],

		snake: {
			x: 160,
			y: 160,
			sx: 15,
			sy: 15,
			dx: 16,
			dy: 0,
			cells: [],
			maxCells: 5
		},

		invincible: {
			is: false,
			frames: 0
		},

		apple: {},
		goldO: {},
		portalIN: {},
		portalOut: {},
		Speeder: {},
		invi: {},

		controls: {
			menu: ['escape'],
			start: ['enter'],
			pause: ['p'],
			reset: ['r'],
			left: ['arrowleft', 'a'],
			up: ['arrowup', 'w'],
			right: ['arrowright', 'd'],
			down: ['arrowdown', 's']
		}
	};
}

// derived constant)
game.MAX_SNAKE_LENGTH = (game.canvas.width / game.grid) * (game.canvas.height / game.grid);

// helpers
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function initEntities() {
	game.apple = {
		x: getRandomInt(0, game.canvas.width / game.grid) * game.grid,
		y: getRandomInt(0, game.canvas.height / game.grid) * game.grid,
		sx: game.grid - 1,
		sy: game.grid - 1
	};

	game.goldO = {
		x: getRandomInt(0, game.canvas.width / game.grid) * game.grid,
		y: getRandomInt(0, game.canvas.height / game.grid) * game.grid,
		sx: game.grid - 1,
		sy: game.grid - 1
	};

	game.portalIN = {
		x: getRandomInt(0, game.canvas.width / game.grid) * game.grid,
		y: getRandomInt(0, game.canvas.height / game.grid) * game.grid,
		sx: game.grid - 1,
		sy: game.grid - 1
	};

	game.portalOut = {
		x: getRandomInt(0, game.canvas.width / game.grid) * game.grid,
		y: getRandomInt(0, game.canvas.height / game.grid) * game.grid,
		sx: game.grid - 1,
		sy: game.grid - 1
	};

	game.Speeder = {
		x: getRandomInt(0, game.canvas.width / game.grid) * game.grid,
		y: getRandomInt(0, game.canvas.height / game.grid) * game.grid,
		sx: game.grid - 1,
		sy: game.grid - 1
	};

	game.invi = {
		x: getRandomInt(0, game.canvas.width / game.grid) * game.grid,
		y: getRandomInt(0, game.canvas.height / game.grid) * game.grid,
		sx: game.grid - 1,
		sy: game.grid - 1
	};
}

function drawCenteredText(text, y, size, color) {
	game.context.fillStyle = color;
	game.context.font = size + "px Arial";
	game.context.textAlign = "center";
	game.context.fillText(text, game.canvas.width / 2, y);
}

function drawStartScreen() {
	game.context.fillStyle = "black";
	game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

	drawCenteredText("SNAKE", 140, 40, "lime");
	drawCenteredText("Press ENTER to Start", 210, 24, "white");
	drawCenteredText("Arrow Keys = Move", 250, 18, "gray");
	drawCenteredText("P = Pause", 280, 18, "gray");
	drawCenteredText("Space = Invincible", 310, 18, "gray");
}

function drawPauseMenu() {
	game.context.fillStyle = "rgba(0,0,0,0.7)";
	game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

	drawCenteredText("PAUSED", 180, 40, "yellow");
	drawCenteredText("Press P to Resume", 230, 24, "white");
	drawCenteredText("Press R to Restart", 270, 24, "white");
}

function reset() {
	game = createDefaultGame();
	initEntities();
}

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function loop() {

	requestAnimationFrame(loop);

	if (!game.gameStarted) {
		drawStartScreen();
		return;
	}

	if (game.paused) {
		drawPauseMenu();
		return;
	}

	if (++game.count < game.speedOfSnake) return;
	game.count = 0;

	game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

	game.snake.x += game.snake.dx;
	game.snake.y += game.snake.dy;

	if (game.snake.x < 0) game.snake.x = game.canvas.width - game.grid;
	else if (game.snake.x >= game.canvas.width) game.snake.x = 0;

	if (game.snake.y < 0) game.snake.y = game.canvas.height - game.grid;
	else if (game.snake.y >= game.canvas.height) game.snake.y = 0;

	game.snake.cells.unshift({ x: game.snake.x, y: game.snake.y });

	while (game.snake.cells.length > game.snake.maxCells) {
		game.snake.cells.pop();
	}

	game.context.fillStyle = 'red';
	game.context.fillRect(game.apple.x, game.apple.y, game.apple.sx, game.apple.sy);

	game.context.fillStyle = 'green';

	game.snake.cells.forEach(function (cell, index) {

		game.context.fillRect(cell.x, cell.y, game.snake.sx, game.snake.sy);

		if (cell.x === game.apple.x && cell.y === game.apple.y) {
			game.snake.maxCells++;
			game.score++;
			game.sCount++;

			game.apple.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
			game.apple.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
		}

		for (var i = index + 1; i < game.snake.cells.length; i++) {
			if (
				cell.x === game.snake.cells[i].x &&
				cell.y === game.snake.cells[i].y &&
				!game.invincible.is
			) {
				reset();
			}
		}
	});

	document.getElementById("ScoreBoard").innerHTML =
		" Score: " + game.score +
		" Gold: " + game.goldCount;
}

document.addEventListener('keydown', function (e) {

	if (game.controls.menu.includes(e.key.toLowerCase())) {
		e.preventDefault();
		game.gameStarted = false;
		game.paused = false;
		reset();
		return;
	}

	if (game.controls.start.includes(e.key.toLowerCase()) && !game.gameStarted) {
		game.gameStarted = true;
		return;
	}

	if (game.controls.pause.includes(e.key.toLowerCase())) {
		game.paused = !game.paused;
		return;
	}

	if (game.controls.reset.includes(e.key.toLowerCase())) {
		var gameStarted = game.gameStarted;
		reset();
		game.gameStarted = gameStarted;
		return;
	}

	if (game.paused || !game.gameStarted) return;

	if (game.controls.left.includes(e.key.toLowerCase()) && game.snake.dx === 0) {
		game.snake.dx = -game.grid;
		game.snake.dy = 0;
	}
	else if (game.controls.up.includes(e.key.toLowerCase()) && game.snake.dy === 0) {
		game.snake.dy = -game.grid;
		game.snake.dx = 0;
	}
	else if (game.controls.right.includes(e.key.toLowerCase()) && game.snake.dx === 0) {
		game.snake.dx = game.grid;
		game.snake.dy = 0;
	}
	else if (game.controls.down.includes(e.key.toLowerCase()) && game.snake.dy === 0) {
		game.snake.dy = game.grid;
		game.snake.dx = 0;
	}
});

initEntities();
requestAnimationFrame(loop);