game = createDefaultGame();

function createDefaultGame() {
	const canvas = document.getElementById('game');

	// Fallback canvas so nothing crashes if #game does not exist yet
	const safeCanvas = canvas || document.createElement('canvas');

	// Ensure width/height always exist
	if (!safeCanvas.width) safeCanvas.width = 400;
	if (!safeCanvas.height) safeCanvas.height = 400;

	const context = safeCanvas.getContext
		? safeCanvas.getContext('2d', { willReadFrequently: true })
		: null;

	const grid = 16;

	function randomGridPos(max) {
		return getRandomInt(0, max) * grid;
	}

	const game = {
		canvas: safeCanvas,
		context: context,

		savedFrame: null,

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

		gold: 0,
		goldCount: 0,

		grid: grid,
		count: 0,

		directionChanged: false,

		MAX_SNAKE_LENGTH:
			(safeCanvas.width / grid) *
			(safeCanvas.height / grid),

		PortalColorIn: ['blue', 'purple', 'cyan', 'gray'],
		PortalColorOut: ['orange', 'purple', 'cyan', 'gray'],
		SpeederColor: ['black', 'white', 'black', 'white'],
	};

	game.speedOfSnake = (5 * game.grid)/16,
	game.originalSpeed = game.speedOfSnake,

	game.snake = {
		x: game.grid * 10,
		y: game.grid * 10,
		sx: game.grid - 1,
		sy: game.grid - 1,

		dx: game.grid,
		dy: 0,

		cells: [],

		maxCells: game.startS
	};

	game.invincible = {
		is: false,
		frames: 0
	};

	game.apple = {
		x: randomGridPos(safeCanvas.width / grid),
		y: randomGridPos(safeCanvas.height / grid),
		sx: grid - 1,
		sy: grid - 1
	};

	game.goldO = {
		x: randomGridPos(safeCanvas.width / grid),
		y: randomGridPos(safeCanvas.height / grid),
		sx: grid - 1,
		sy: grid - 1
	};

	game.portalIN = {
		x: randomGridPos(safeCanvas.width / grid),
		y: randomGridPos(safeCanvas.height / grid),
		sx: grid - 1,
		sy: grid - 1
	};

	game.portalOut = {
		x: randomGridPos(safeCanvas.width / grid),
		y: randomGridPos(safeCanvas.height / grid),
		sx: grid - 1,
		sy: grid - 1
	};

	game.Speeder = {
		x: randomGridPos(safeCanvas.width / grid),
		y: randomGridPos(safeCanvas.height / grid),
		sx: grid - 1,
		sy: grid - 1
	};

	game.invi = {
		x: randomGridPos(safeCanvas.width / grid),
		y: randomGridPos(safeCanvas.height / grid),
		sx: grid - 1,
		sy: grid - 1
	};

	game.controls = {
		start: ['enter'],
		pause: ['p'],
		reset: ['r'],
		up: ['arrowup'],
		down: ['arrowdown'],
		left: ['arrowleft'],
		right: ['arrowright'],
		exit: ['escape'],
		invince: ['space']
	}

	game.objects = [game.apple, game.goleO, game.portalIn, game.portalOut, game.Speeder, game.invi]

	return game;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
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
	drawCenteredText("R = Restart", 300, 18, "white");
	drawCenteredText("Space = Invincible", 320, 18, "gray");
}

function drawPauseMenu() {
	
	if (!game.savedFrame) {
		game.savedFrame = game.context.getImageData(
			0,
			0,
			game.canvas.width,
			game.canvas.height
		);
	}

	game.context.putImageData(game.savedFrame, 0, 0);

	game.context.fillStyle = "rgba(0,0,0,0.3)";
	game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

	drawCenteredText("PAUSED", 180, 40, "yellow");
	drawCenteredText("Press P to Resume", 230, 24, "white");
	drawCenteredText("Press R to Restart", 270, 24, "white");
}

function reset() {
	var started = game.gameStarted;
	game = createDefaultGame();
	game.gameStarted = started;
}

function collide(obj1, obj2) {
	if (!obj1 || !obj2) return false;

	return (obj1.x == obj2.x && obj1.y == obj2.y);
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

	if (++game.count < game.speedOfSnake) {
		return;
	}

	game.count = 0;
	game.directionChanged = false;

	game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

	game.snake.x += game.snake.dx;
	game.snake.y += game.snake.dy;

	if (game.snake.x < 0) {
		game.snake.x = game.canvas.width - game.grid;
	}
	else if (game.snake.x >= game.canvas.width) {
		game.snake.x = 0;
	}

	if (game.snake.y < 0) {
		game.snake.y = game.canvas.height - game.grid;
	}
	else if (game.snake.y >= game.canvas.height) {
		game.snake.y = 0;
	}

	game.snake.cells.unshift({
		x: game.snake.x,
		y: game.snake.y
	});

	if (game.snake.maxCells > game.MAX_SNAKE_LENGTH) {
		game.snake.maxCells = game.MAX_SNAKE_LENGTH;
	}

	while (game.snake.cells.length > game.snake.maxCells) {
		game.snake.cells.pop();
	}

	game.context.fillStyle = 'red';
	game.context.fillRect(game.apple.x, game.apple.y, game.apple.sx, game.apple.sy);

	if (game.goldCount >= game.InvinciC) {
		game.context.fillStyle = 'orange';
		game.context.fillRect(game.invi.x, game.invi.y, game.grid - 1, game.grid - 1);
	}

	if (game.sCount >= game.PFgold) {
		game.context.fillStyle = 'yellow';
		game.context.fillRect(game.goldO.x, game.goldO.y, game.grid - 1, game.grid - 1);
	}

	if (game.score > 10) {

		game.context.fillStyle = game.PortalColorIn[getRandomInt(0, 4)];
		game.context.fillRect(game.portalIN.x, game.portalIN.y, game.grid - 1, game.grid - 1);

		game.context.fillStyle = game.PortalColorOut[getRandomInt(0, 4)];
		game.context.fillRect(game.portalOut.x, game.portalOut.y, game.grid - 1, game.grid - 1);
	}

	if (game.gold >= game.SpeederCost) {

		game.context.fillStyle = game.SpeederColor[game.count % 4];
		game.context.fillRect(game.Speeder.x, game.Speeder.y, game.grid - 1, game.grid - 1);
	}

	game.context.fillStyle = 'green';

	game.snake.cells.forEach(function (cell, index) {

		game.context.fillRect(cell.x, cell.y, game.snake.sx, game.snake.sy);

		if (collide(cell, game.apple)) {

			if (game.snake.maxCells < game.MAX_SNAKE_LENGTH) {
				game.snake.maxCells++;
			}

			game.score++;
			game.sCount++;

			game.apple.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
			game.apple.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
		}

		if (game.score > 10) {

			if (collide(cell, game.portalIN)) {

				game.snake.x = game.portalOut.x;
				game.snake.y = game.portalOut.y;

				game.snake.dx *= -1;
				game.snake.dy *= -1;

				game.portalIN.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
				game.portalIN.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
			}

			if (collide(cell, game.portalOut)) {

				game.snake.x = game.portalIN.x;
				game.snake.y = game.portalIN.y;

				game.snake.dx *= -1;
				game.snake.dy *= -1;

				game.portalOut.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
				game.portalOut.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
			}
		}

		if (game.gold >= game.SpeederCost) {

			if (collide(cell, game.Speeder)) {

				game.gold = Math.abs(game.gold - game.SpeederCost);

				if (game.originalSpeed != game.speedOfSnake) {
					game.speedOfSnake -= 3;
				}
				else {
					game.speedOfSnake += 3;
				}

				if (game.speedOfSnake < 1) {
					game.speedOfSnake = 1;
				}

				game.Speeder.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
				game.Speeder.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
			}
		}

		if (game.sCount >= game.PFgold) {

			if (collide(cell, game.goldO)) {

				game.sCount -= game.PFgold;

				game.goldCount++;
				game.gold++;

				game.goldO.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
				game.goldO.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
			}
		}

		if (collide(cell, game.invi) && game.goldCount >= game.InvinciC
		) {

			game.Icharge += getRandomInt(1, 5);

			game.goldCount -= game.InvinciC;

			game.invi.x = getRandomInt(0, game.canvas.width / game.grid) * game.grid;
			game.invi.y = getRandomInt(0, game.canvas.height / game.grid) * game.grid;
		}

		for (var i = index + 1; i < game.snake.cells.length; i++) {

			if (!game.invincible.is) {

				if (collide(cell, game.snake.cells[i])) {
					reset();
				}
			}
		}

		if (game.invincible.is) {
			game.invincible.frames++;
		}

		if (game.invincible.frames > ((10 * game.speedOfSnake) * game.snake.cells.length)) {

			game.invincible.is = false;
			game.invincible.frames = 0;
		}
	});

	document.getElementById("ScoreBoard").innerHTML =
		" Score: " + game.score +
		" Gold: " + game.goldCount

	if (game.Icharge > 0) {

		document.getElementById("ScoreBoard").innerHTML += " Charges: ";

		for (var i = 0; i < game.Icharge; i++) {
			document.getElementById("ScoreBoard").innerHTML += "|";
		}
	}

	if (game.invincible.is) {

		document.getElementById("ScoreBoard").innerHTML +=
			" iframes: " +
			(((10 * game.speedOfSnake) * game.snake.cells.length) - game.invincible.frames);
	}
}

function gameControlsTest(name, ...input) {
	if (!game || !game.controls || !game.controls[name]) {
		return false;
	}

	var isIncluded = false;
	var i = 0;

	while (!isIncluded && i < input.length) {
		isIncluded = game.controls[name].includes(
			String(input[i]).toLowerCase()
		);
		i++;
	}

	return isIncluded;
}

document.addEventListener('keydown', function (e) {

	if (gameControlsTest('exit', e.which, e.key) && game.gameStarted) {
		e.preventDefault();
		game = createDefaultGame();
		return;
	}

	if (gameControlsTest('start', e.which, e.key) && !game.gameStarted) {
		game.gameStarted = true;
		return;
	}

	if (gameControlsTest('pause', e.which, e.key) && game.gameStarted) {
		game.paused = !game.paused;
		if(!game.paused){
			game.savedFrame = null;
		}
		return;
	}

	if (gameControlsTest('reset', e.which, e.key)) {
		reset();
		return;
	}

	if (game.paused || !game.gameStarted || game.directionChanged) {
		return;
	}

	if (gameControlsTest('left', e.which, e.key) && game.snake.dx === 0) {
		game.snake.dx = -game.grid;
		game.snake.dy = 0;
		game.directionChanged = true;
	}

	else if (gameControlsTest('up', e.which, e.key) && game.snake.dy === 0) {
		game.snake.dy = -game.grid;
		game.snake.dx = 0;
		game.directionChanged = true;
	}

	else if (gameControlsTest('right', e.which, e.key) && game.snake.dx === 0) {
		game.snake.dx = game.grid;
		game.snake.dy = 0;
		game.directionChanged = true;
	}

	else if (gameControlsTest('down', e.which, e.key) && game.snake.dy === 0) {
		game.snake.dy = game.grid;
		game.snake.dx = 0;
		game.directionChanged = true;
	}

	else if (
		gameControlsTest('invince', e.which, e.key) &&
		game.invincible.is === false &&
		game.Icharge > 0 &&
		game.goldCount >= game.InvinciC
	) {

		game.Icharge--;

		game.invincible.frames = 10;
		game.invincible.is = true;
	}
});

requestAnimationFrame(loop);