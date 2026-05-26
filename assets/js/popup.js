class Snake {
	x;
	y;
	sx;
	sy;

	dx;
	dy;

	cells = [];
	maxCells;

	constructor(x, y, sx = 15, sy = 15, dx = 0, dy = 0, maxCells = 5) {
		this.x = x;
		this.y = y;
		this.sx = sx;
		this.sy = sy;
		this.dx = dx;
		this.dy = dy;
		this.maxCells = maxCells;
	}

	move(loopWidth = 400, loopHeight = 400) {
		this.x += this.dx;
		this.y += this.dy;

		if (this.x < 0) this.x = loopWidth - (this.sx + 1);
		else if (this.x >= loopWidth) this.x = 0;

		if (this.y < 0) this.y = loopHeight - (this.sy + 1);
		else if (this.y >= loopHeight) this.y = 0;

		this.cells.unshift({ x: this.x, y: this.y });

		while (this.cells.length > this.maxCells) {
			this.cells.pop();
		}
	}

	draw(drawCanvas, headColor = 'rgb(4, 90, 69)', bodyColor = 'green') {
		this.cells.forEach((cell, index) => {
			drawCanvas.fillStyle = index === 0 ? headColor : bodyColor;
			drawCanvas.fillRect(cell.x, cell.y, this.sx, this.sy);
		});
	}

	partCollides(index, collideX, collideY) {
		return collide(this.cells[index], { x: collideX, y: collideY });
	}

	anyCollides(collideX, collideY) {
		for (let i = 0; i < this.cells.length; i++) {
			if (this.partCollides(i, collideX, collideY)) return true;
		}
		return false;
	}
}

class Collectable {
	x;
	y;
	sx;
	sy;
	colors = ["red"];
	tickCount = 0;

	connectedObjects = [];

	colorFunction = () => this.colors[0];
	collideFunction = (...inputs) => { }
	drawCondtion = () => { return true; }
	drawFunction = (drawCanvas, ...inputs) => { drawCanvas.fillRect(this.x, this.y, this.sx, this.sy); }
	collideCondition = () => { return true; }


	constructor(x, y, sx = 15, sy = 15, colors = null, colorFunction = null, collideFunction = null, drawCondition = null, drawFunction = null, collideCondition = null, ...connectedObjects) {
		this.x = x;
		this.y = y;
		this.sx = sx;
		this.sy = sy;
		if(colors){
			this.colors = colors;
		}
		if (colorFunction) this.colorFunction = colorFunction.bind(this);
		if (collideFunction) this.collideFunction = collideFunction.bind(this);
		if (drawCondition) this.drawCondtion = drawCondition.bind(this);
		if (drawFunction) this.drawFunction = drawFunction.bind(this);
		if (collideCondition) this.collideCondition = collideCondition.bind(this);
		if(connectedObjects) this.connectedObjects = connectedObjects;
	}

	draw(drawCanvas, ...inputs) {
		drawCanvas.fillStyle = this.colorFunction(this.tickCount);
		if (this.drawCondtion(...inputs)) {
			this.drawFunction(drawCanvas, ...inputs);
		}
	}

	collided(...inputs) {
		if (this.collideCondition()) {
			this.collideFunction(...inputs);
		}
	}

	tick() {
		this.tickCount++;
	}

	addConnected(...objs){
		objs.forEach((obj) => {this.connectedObjects.push(obj)});
	}

	removeConnected(...objs){
		objs.forEach((obj) => { 
			this.connectedObjects.splice(this.connectedObjects.indexOf(obj), 1);
		});
	}

	removeConnectedIndexs(...indexs) {
		indexs.forEach((index) => {
			this.connectedObjects.splice(index, 1);
		});
	}
}

let gameState = createDefaultGame();

const scoreBoardElement = document.getElementById("ScoreBoard");

function createDefaultGame() {
	const canvasEl = document.getElementById('game') || document.createElement('canvas');

	if (!canvasEl.width) canvasEl.width = 400;
	if (!canvasEl.height) canvasEl.height = 400;

	const ctx = canvasEl.getContext
		? canvasEl.getContext('2d', { willReadFrequently: true })
		: null;

	const cellSize = 16;

	function getRandomGridPosition(max) {
		return getRandomInt(0, max) * cellSize;
	}

	function randomizePositionNoSnake(obj) {
		do {
			obj.x = getRandomInt(0, canvasEl.width / state.grid) * state.grid;
			obj.y = getRandomInt(0, canvasEl.height / state.grid) * state.grid;

		} while (
			state.snake.anyCollides(obj.x, obj.y) ||
			state.objects.some(function (stateObject) {
				if(stateObject !== obj && collide(stateObject, obj)){
					return true;
				}
			})
		);
	}

	const state = {
		canvas: canvasEl,
		context: ctx,

		savedFrame: null,
		gameStarted: false,
		paused: false,

		goldSpawnScoreThreshold: 5,
		goldSpawnProgress: 0,

		invincibilityCost: 2,
		invincibilityCharges: 0,
		invincibilityDuration: 5,

		score: 0,

		startLength: 5,

		goldCount: 0,

		grid: cellSize,
		count: 0,

		directionChanged: false,

		PortalColorIn: ['blue', 'purple', 'cyan', 'gray'],
		PortalColorOut: ['orange', 'purple', 'cyan', 'gray']
	};

	state.speedOfSnake = (5 * state.grid) / 16;

	state.snake = new Snake(state.grid * 10, state.grid * 10, state.grid - 1, state.grid - 1, state.grid, 0, state.startLength)

	state.invincible = {
		is: false,
		endTime: 0
	};

	state.apple = new Collectable(
		getRandomGridPosition(canvasEl.width / cellSize),
		getRandomGridPosition(canvasEl.height / cellSize),
		cellSize - 1,
		cellSize - 1,
		null,
		null,
		function () {
			state.snake.maxCells++;
			state.score++;
			state.goldSpawnProgress++;
			randomizePositionNoSnake(this);
		}
	);

	state.goldOrb = new Collectable(
		getRandomGridPosition(canvasEl.width / cellSize),
		getRandomGridPosition(canvasEl.height / cellSize),
		cellSize - 1,
		cellSize - 1,
		["yellow"],
		null,
		function () {
			state.goldSpawnProgress -= state.goldSpawnScoreThreshold;
			state.goldCount++;
			randomizePositionNoSnake(this);
		},
		function () {
			return state.goldSpawnProgress >= state.goldSpawnScoreThreshold;
		},
		null
		,
		function () {
			return state.goldSpawnProgress >= state.goldSpawnScoreThreshold;
		}
	);

	state.portalIN = new Collectable(
		getRandomGridPosition(canvasEl.width / cellSize),
		getRandomGridPosition(canvasEl.height / cellSize),
		cellSize - 1,
		cellSize - 1,
		state.PortalColorIn,
		function() {
			return this.colors[getRandomInt(0, this.colors.length)]
		},
		function () {
			state.snake.dx *= -1;
			state.snake.dy *= -1;
			state.snake.x = this.connectedObjects[0].x;
			state.snake.y = this.connectedObjects[0].y;

			randomizePositionNoSnake(this);
		},
		function () {
			return state.score >= 10;
		},
		null,
		function () {
			return state.score >= 10;
		}
	)

	state.portalOut = new Collectable(
		getRandomGridPosition(canvasEl.width / cellSize),
		getRandomGridPosition(canvasEl.height / cellSize),
		cellSize - 1,
		cellSize - 1,
		state.PortalColorOut,
		function () {
			return this.colors[getRandomInt(0, this.colors.length)]
		},
		function () {
			state.snake.dx *= -1;
			state.snake.dy *= -1;
			state.snake.x = this.connectedObjects[0].x;
			state.snake.y = this.connectedObjects[0].y;
			
			randomizePositionNoSnake(this);
		},
		function () {
			return state.score >= 10;
		},
		null,
		function () {
			return state.score >= 10;
		}
	)

	state.portalIN.addConnected(state.portalOut);
	state.portalOut.addConnected(state.portalIN);

	state.invi = new Collectable(
		getRandomGridPosition(canvasEl.width / cellSize),
		getRandomGridPosition(canvasEl.height / cellSize),
		cellSize - 1,
		cellSize - 1,
		["orange"],
		null,
		function () {
			state.invincibilityCharges += getRandomInt(1, 5);
			state.goldCount -= gameState.invincibilityCost;
			randomizePositionNoSnake(this);
		},
		function () {
			return state.goldCount >= state.invincibilityCost;
		},
		null,
		function () {
			return state.goldCount >= state.invincibilityCost;
		}
	);

	state.controls = {
		start: ['enter'],
		pause: ['p'],
		reset: ['r'],
		up: ['arrowup'],
		down: ['arrowdown'],
		left: ['arrowleft'],
		right: ['arrowright'],
		exit: ['escape'],
		invincible: ['space']
	};

	state.objects = [state.apple, state.goldOrb, state.portalIN, state.portalOut, state.invi];

	return state;
}

function getMousePosition(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	return { x: event.clientX - canvas.getBoundingClientRect().left, y: event.clientY - canvas.getBoundingClientRect().top };
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function drawCenteredText(text, y, size, color) {
	gameState.context.fillStyle = color;
	gameState.context.font = size + "px Arial";
	gameState.context.textAlign = "center";
	gameState.context.fillText(text, gameState.canvas.width / 2, y);
}

function drawStartScreen() {
	gameState.context.fillStyle = "black";
	gameState.context.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);

	drawCenteredText("SNAKE", 140, 40, "lime");
	drawCenteredText("Press ENTER to Start", 210, 24, "white");
	drawCenteredText("Arrow Keys = Move", 250, 18, "gray");
	drawCenteredText("P = Pause", 280, 18, "gray");
	drawCenteredText("R = Restart", 300, 18, "white");
	drawCenteredText("Space = Invincible", 320, 18, "gray");
}

function drawPauseMenu() {
	if (!gameState.savedFrame) {
		gameState.savedFrame = gameState.context.getImageData(
			0,
			0,
			gameState.canvas.width,
			gameState.canvas.height
		);
	}

	gameState.context.putImageData(gameState.savedFrame, 0, 0);
	gameState.context.fillStyle = "rgba(0,0,0,0.3)";
	gameState.context.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);

	drawCenteredText("PAUSED", 180, 40, "yellow");
	drawCenteredText("Press P to Resume", 230, 24, "white");
	drawCenteredText("Press R to Restart", 270, 24, "white");
}

function reset() {
	const started = gameState.gameStarted;
	const paused = gameState.paused;
	gameState = createDefaultGame();
	gameState.gameStarted = started;
	gameState.paused = paused;
}

function collide(obj1, obj2) {
	if (!obj1 || !obj2) return false;
	return obj1.x == obj2.x && obj1.y == obj2.y;
}

function loop() {
	requestAnimationFrame(loop);

	if (gameState.invincible.is && performance.now() >= gameState.invincible.endTime) {
		gameState.invincible.is = false;
	}

	if (!gameState.gameStarted) return drawStartScreen();
	if (gameState.paused) return drawPauseMenu();

	if (++gameState.count < gameState.speedOfSnake) return;
	gameState.count = 0;
	gameState.directionChanged = false;


	gameState.context.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);

	gameState.snake.move(gameState.canvas.width, gameState.canvas.height)

	gameState.snake.draw(gameState.context);

	gameState.objects.forEach(function (obj) {
		if (obj instanceof Collectable) {
			if (gameState.snake.partCollides(0, obj.x, obj.y)) {
				obj.collided();
			}
			obj.tick();
			obj.draw(gameState.context);
		}
	})

	gameState.snake.cells.forEach(function (cell, index) {
		for (let i = index + 1; i < gameState.snake.cells.length; i++) {
			if (collide(cell, gameState.snake.cells[i]) && !gameState.invincible.is) reset();
		}
	});

	scoreBoardElement.innerHTML =
		"Score: " + gameState.score +
		" | Gold: " + gameState.goldCount +
		" | Invincibility: " + gameState.invincibilityCharges +
		(gameState.invincible.is
		? " | ACTIVE (" + ((gameState.invincible.endTime - performance.now()) / 1000).toFixed(1) + "s)"
			: "");
	
	
}

function gameControlsTest(name, ...input) {
	if (!gameState.controls?.[name]) return false;
	return input.some(i => gameState.controls[name].includes(String(i).toLowerCase()));
}

document.addEventListener('mousedown', function (e){
	if(!gameState.gameStarted){
		gameState.gameStarted = true;
		return;
	}
})

document.addEventListener('keydown', function (e) {
	if (gameControlsTest('exit', e.which, e.key, e.code) && gameState.gameStarted) {
		e.preventDefault();
		gameState = createDefaultGame();
		return;
	}

	if (gameControlsTest('start', e.which, e.key, e.code) && !gameState.gameStarted) {
		gameState.gameStarted = true;
		return;
	}

	if (gameControlsTest('pause', e.which, e.key, e.code) && gameState.gameStarted) {
		gameState.paused = !gameState.paused;
		if (!gameState.paused) gameState.savedFrame = null;
		return;
	}

	if (gameControlsTest('reset', e.which, e.key, e.code)) {
		reset();
		return;
	}

	if (gameState.paused || !gameState.gameStarted || gameState.directionChanged) return;

	if (gameControlsTest('left', e.which, e.key, e.code) && gameState.snake.dx === 0) {
		gameState.snake.dx = -gameState.grid;
		gameState.snake.dy = 0;
		gameState.directionChanged = true;
	} else if (gameControlsTest('up', e.which, e.key, e.code) && gameState.snake.dy === 0) {
		gameState.snake.dy = -gameState.grid;
		gameState.snake.dx = 0;
		gameState.directionChanged = true;
	} else if (gameControlsTest('right', e.which, e.key, e.code) && gameState.snake.dx === 0) {
		gameState.snake.dx = gameState.grid;
		gameState.snake.dy = 0;
		gameState.directionChanged = true;
	} else if (gameControlsTest('down', e.which, e.key, e.code) && gameState.snake.dy === 0) {
		gameState.snake.dy = gameState.grid;
		gameState.snake.dx = 0;
		gameState.directionChanged = true;
	} else if (gameControlsTest('invincible', e.which, e.key, e.code) && !gameState.invincible.is && gameState.invincibilityCharges > 0) {
		gameState.invincibilityCharges--;
		gameState.invincible.is = true;
		gameState.invincible.endTime = performance.now() + gameState.invincibilityDuration * 1000;
	}

});

requestAnimationFrame(loop);