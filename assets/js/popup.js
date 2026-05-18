var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var gameStarted = false;
var paused = false;

var start = false;
var SpeederCost = 2;
var PFgold = 5;
var InvinciC = 10;
var Icharge = 0;
var score = 0;
var sCount = 0;

var startS = 5;

var speedOfSnake = 5;
var originalSpeed = speedOfSnake;

var gold = 0;
var goldCount = 0;

var grid = 16;
var count = 0;

var MAX_SNAKE_LENGTH = (canvas.width / grid) * (canvas.height / grid);

var PortalColorIn = ['blue', 'purple', 'cyan', 'gray'];
var PortalColorOut = ['orange', 'purple', 'cyan', 'gray'];
var SpeederColor = ['black', 'white', 'black', 'white'];

var snake = {
	x: grid * 10,
	y: grid * 10,
	sx: grid - 1,
	sy: grid - 1,

	dx: grid,
	dy: 0,

	cells: [],

	maxCells: startS
};

var invincible = {
	is: false,
	frames: 0
};

var apple = {
	x: getRandomInt(0, canvas.width / grid) * grid,
	y: getRandomInt(0, canvas.height / grid) * grid,
	sx: grid - 1,
	sy: grid - 1
};

var goldO = {
	x: getRandomInt(0, canvas.width / grid) * grid,
	y: getRandomInt(0, canvas.height / grid) * grid,
	sx: grid - 1,
	sy: grid - 1
};

var portalIN = {
	x: getRandomInt(0, canvas.width / grid) * grid,
	y: getRandomInt(0, canvas.height / grid) * grid,
	sx: grid - 1,
	sy: grid - 1
};

var portalOut = {
	x: getRandomInt(0, canvas.width / grid) * grid,
	y: getRandomInt(0, canvas.height / grid) * grid,
	sx: grid - 1,
	sy: grid - 1
};

var Speeder = {
	x: getRandomInt(0, canvas.width / grid) * grid,
	y: getRandomInt(0, canvas.height / grid) * grid,
	sx: grid - 1,
	sy: grid - 1
};

var invi = {
	x: getRandomInt(0, canvas.width / grid) * grid,
	y: getRandomInt(0, canvas.height / grid) * grid,
	sx: grid - 1,
	sy: grid - 1
};

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
	drawCenteredText("Arrow Keys = Move", 250, 18, "gray");
	drawCenteredText("P = Pause", 280, 18, "gray");
	drawCenteredText("Space = Invincible", 310, 18, "gray");
	drawCenteredText("K = Save", 340, 18, "gray");
	drawCenteredText("L = Load", 370, 18, "gray");
}

function drawPauseMenu() {
	context.fillStyle = "rgba(0,0,0,0.7)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawCenteredText("PAUSED", 180, 40, "yellow");
	drawCenteredText("Press P to Resume", 230, 24, "white");
	drawCenteredText("Press R to Restart", 270, 24, "white");
}

function saveGame() {

	chrome.storage.local.set({
		saveData: {
			gameStarted: gameStarted,
			paused: paused,

			start: start,
			SpeederCost: SpeederCost,
			PFgold: PFgold,
			InvinciC: InvinciC,
			Icharge: Icharge,
			score: score,
			sCount: sCount,

			startS: startS,

			speedOfSnake: speedOfSnake,
			originalSpeed: originalSpeed,

			gold: gold,
			goldCount: goldCount,

			count: count,

			snake: snake,
			invincible: invincible,

			apple: apple,
			goldO: goldO,
			portalIN: portalIN,
			portalOut: portalOut,
			Speeder: Speeder,
			invi: invi
		}
	});
}

function loadGame() {

	chrome.storage.local.get(['saveData'], function (data) {

		if (!data.saveData) {
			return;
		}

		var save = data.saveData;

		gameStarted = save.gameStarted;
		paused = save.paused;

		start = save.start;
		SpeederCost = save.SpeederCost;
		PFgold = save.PFgold;
		InvinciC = save.InvinciC;
		Icharge = save.Icharge;
		score = save.score;
		sCount = save.sCount;

		startS = save.startS;

		speedOfSnake = save.speedOfSnake;
		originalSpeed = save.originalSpeed;

		gold = save.gold;
		goldCount = save.goldCount;

		count = save.count;

		snake = save.snake;
		invincible = save.invincible;

		apple = save.apple;
		goldO = save.goldO;
		portalIN = save.portalIN;
		portalOut = save.portalOut;
		Speeder = save.Speeder;
		invi = save.invi;
	});
}

function deleteSave() {
	chrome.storage.local.remove(['saveData']);
}

function reset(deleteSavedGame = true) {

	snake.x = grid * 10;
	snake.y = grid * 10;
	snake.cells = [];
	snake.maxCells = startS;
	snake.dx = grid;
	snake.dy = 0;

	sCount = 0;
	score = 0;

	speedOfSnake = 5;
	originalSpeed = speedOfSnake;

	gold = 0;
	PFgold = 5;
	Icharge = 0;
	InvinciC = 5;
	goldCount = 0;

	invincible.is = false;
	invincible.frames = 0;

	apple.x = getRandomInt(0, canvas.width / grid) * grid;
	apple.y = getRandomInt(0, canvas.height / grid) * grid;

	goldO.x = getRandomInt(0, canvas.width / grid) * grid;
	goldO.y = getRandomInt(0, canvas.height / grid) * grid;

	portalIN.x = getRandomInt(0, canvas.width / grid) * grid;
	portalIN.y = getRandomInt(0, canvas.height / grid) * grid;

	portalOut.x = getRandomInt(0, canvas.width / grid) * grid;
	portalOut.y = getRandomInt(0, canvas.height / grid) * grid;

	Speeder.x = getRandomInt(0, canvas.width / grid) * grid;
	Speeder.y = getRandomInt(0, canvas.height / grid) * grid;

	invi.x = getRandomInt(0, canvas.width / grid) * grid;
	invi.y = getRandomInt(0, canvas.height / grid) * grid;

	if (deleteSavedGame) {
		deleteSave();
	}
}

function loop() {

	requestAnimationFrame(loop);

	if (!gameStarted) {
		drawStartScreen();
		return;
	}

	if (paused) {
		drawPauseMenu();
		return;
	}

	if (++count < speedOfSnake) {
		return;
	}

	count = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);

	snake.x += snake.dx;
	snake.y += snake.dy;

	if (snake.x < 0) {
		snake.x = canvas.width - grid;
	}
	else if (snake.x >= canvas.width) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - grid;
	}
	else if (snake.y >= canvas.height) {
		snake.y = 0;
	}

	snake.cells.unshift({
		x: snake.x,
		y: snake.y
	});

	if (snake.maxCells > MAX_SNAKE_LENGTH) {
		snake.maxCells = MAX_SNAKE_LENGTH;
	}

	while (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}

	context.fillStyle = 'red';
	context.fillRect(apple.x, apple.y, apple.sx, apple.sy);

	if (goldCount >= InvinciC) {
		context.fillStyle = 'orange';
		context.fillRect(invi.x, invi.y, grid - 1, grid - 1);
	}

	if (sCount >= PFgold) {
		context.fillStyle = 'yellow';
		context.fillRect(goldO.x, goldO.y, grid - 1, grid - 1);
	}

	if (score > 10) {

		context.fillStyle = PortalColorIn[getRandomInt(0, 4)];
		context.fillRect(portalIN.x, portalIN.y, grid - 1, grid - 1);

		context.fillStyle = PortalColorOut[getRandomInt(0, 4)];
		context.fillRect(portalOut.x, portalOut.y, grid - 1, grid - 1);
	}

	if (gold >= SpeederCost) {

		context.fillStyle = SpeederColor[getRandomInt(0, 4)];
		context.fillRect(Speeder.x, Speeder.y, grid - 1, grid - 1);
	}

	context.fillStyle = 'green';

	snake.cells.forEach(function (cell, index) {

		context.fillRect(cell.x, cell.y, snake.sx, snake.sy);

		if (
			cell.x === apple.x &&
			cell.y === apple.y
		) {

			if (snake.maxCells < MAX_SNAKE_LENGTH) {
				snake.maxCells++;
			}

			score++;
			sCount++;

			apple.x = getRandomInt(0, canvas.width / grid) * grid;
			apple.y = getRandomInt(0, canvas.height / grid) * grid;
		}

		if (score > 10) {

			if (cell.x === portalIN.x && cell.y === portalIN.y) {

				snake.x = portalOut.x;
				snake.y = portalOut.y;

				snake.dx *= -1;
				snake.dy *= -1;

				portalIN.x = getRandomInt(0, canvas.width / grid) * grid;
				portalIN.y = getRandomInt(0, canvas.height / grid) * grid;
			}

			if (cell.x === portalOut.x && cell.y === portalOut.y) {

				snake.x = portalIN.x;
				snake.y = portalIN.y;

				snake.dx *= -1;
				snake.dy *= -1;

				portalOut.x = getRandomInt(0, canvas.width / grid) * grid;
				portalOut.y = getRandomInt(0, canvas.height / grid) * grid;
			}
		}

		if (gold >= SpeederCost) {

			if (cell.x === Speeder.x && cell.y === Speeder.y) {

				gold = Math.abs(gold - SpeederCost);

				if (originalSpeed != speedOfSnake) {
					speedOfSnake -= 3;
				}
				else {
					speedOfSnake += 3;
				}

				if (speedOfSnake < 1) {
					speedOfSnake = 1;
				}

				Speeder.x = getRandomInt(0, canvas.width / grid) * grid;
				Speeder.y = getRandomInt(0, canvas.height / grid) * grid;
			}
		}

		if (sCount >= PFgold) {

			if (cell.x === goldO.x && cell.y === goldO.y) {

				sCount -= PFgold;

				goldCount++;
				gold++;

				var checkRTF = getRandomInt(0, 10);

				if (checkRTF == 5) {

					snake.maxCells *= 2;

					if (snake.maxCells > MAX_SNAKE_LENGTH) {
						snake.maxCells = MAX_SNAKE_LENGTH;
					}

					score *= 2;
				}
				else {

					snake.maxCells += 2;

					if (snake.maxCells > MAX_SNAKE_LENGTH) {
						snake.maxCells = MAX_SNAKE_LENGTH;
					}

					score += 2;
				}

				goldO.x = getRandomInt(0, canvas.width / grid) * grid;
				goldO.y = getRandomInt(0, canvas.height / grid) * grid;
			}
		}

		if (
			cell.x === invi.x &&
			cell.y === invi.y &&
			goldCount >= InvinciC
		) {

			Icharge += getRandomInt(1, 5);

			goldCount -= InvinciC;

			invi.x = getRandomInt(0, canvas.width / grid) * grid;
			invi.y = getRandomInt(0, canvas.height / grid) * grid;
		}

		for (var i = index + 1; i < snake.cells.length; i++) {

			if (!invincible.is) {

				if (
					cell.x === snake.cells[i].x &&
					cell.y === snake.cells[i].y
				) {

					reset(false);
				}
			}
		}

		if (invincible.is) {
			invincible.frames++;
		}

		if (invincible.frames > ((10 * speedOfSnake) * snake.cells.length)) {

			invincible.is = false;
			invincible.frames = 0;
		}
	});

	document.getElementById("ScoreBoard").innerHTML =
		" Score: " + score +
		" gold: " + goldCount

	if (Icharge > 0) {

		document.getElementById("ScoreBoard").innerHTML += " Charges: ";

		for (var i = 0; i < Icharge; i++) {
			document.getElementById("ScoreBoard").innerHTML += "|";
		}
	}

	if (invincible.is) {

		document.getElementById("ScoreBoard").innerHTML +=
			" iframes: " +
			(((10 * speedOfSnake) * snake.cells.length) - invincible.frames);
	}

	saveGame();
}

document.addEventListener('keydown', function (e) {

	if (e.which === 13 && !gameStarted) {
		gameStarted = true;
		return;
	}

	if (e.which === 80 && gameStarted) {
		paused = !paused;
		return;
	}

	if (e.which === 82) {
		reset();
		return;
	}

	if (e.which === 75) {
		saveGame();
		return;
	}

	if (e.which === 76) {
		loadGame();
		return;
	}

	if (paused || !gameStarted) {
		return;
	}

	if (e.which === 37 && snake.dx === 0) {
		snake.dx = -grid;
		snake.dy = 0;
	}

	else if (e.which === 38 && snake.dy === 0) {
		snake.dy = -grid;
		snake.dx = 0;
	}

	else if (e.which === 39 && snake.dx === 0) {
		snake.dx = grid;
		snake.dy = 0;
	}

	else if (e.which === 40 && snake.dy === 0) {
		snake.dy = grid;
		snake.dx = 0;
	}

	else if (
		e.which === 32 &&
		invincible.is === false &&
		Icharge > 0 &&
		goldCount >= InvinciC
	) {

		Icharge--;

		invincible.frames = 10;
		invincible.is = true;
	}
});

loadGame();

requestAnimationFrame(loop);