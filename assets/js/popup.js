	
	var canvas = document.getElementById('game');
	var context = canvas.getContext('2d');
	
	var start = false;
	var SpeederCost = 2;
	var PFgold = 5;
	var InvinciC = 10;
	var Icharge = 0;
	var score = 0;
	var sCount = 0; 
	var startS = 300;
	var speedOfSnake = 5;
	var originalSpeed = speedOfSnake;
	var gold = 0;
	var goldCount = 0;
	var grid = 16;
	var count = 0;
	var PortalColorIn = ['blue', 'purple', 'cyan', 'gray'];
	var PortalColorOut = ['orange', 'purple', 'cyan', 'gray'];
	var SpeederColor = ['black', 'white', 'black', 'white',];
	var snake = {
	  x: grid*10,
	  y: grid*10,
	  sx: grid-1,
	  sy: grid-1,
	
	  // snake velocity. moves one grid length every frame in either the x or y direction
	  dx: grid,
	  dy: 0,
	
	  // keep track of all grids the snake body occupies
	  cells: [],
	
	  // length of the snake. grows when eating an apple
	  maxCells: startS
	};
	
	var invincible = {
		is: false,
		frames: 0
	};
	
	var apple = {
	  x: getRandomInt(0, canvas.width/grid) * grid,
	  y: getRandomInt(0, canvas.height/grid) * grid,
	  sx: grid-1,
	  sy: grid-1
	};
	
	var goldO = {
	  x: getRandomInt(0, canvas.width/grid) * grid,
	  y: getRandomInt(0, canvas.height/grid) * grid,
	  sx: grid-1,
	  sy: grid-1
	};
	
	var portalIN = {
	  x: getRandomInt(0, canvas.width/grid) * grid,
	  y: getRandomInt(0, canvas.height/grid) * grid,
	  sx: grid-1,
	  sy: grid-1
	};
	
	var portalOut = {
	  x: getRandomInt(0, canvas.width/grid) * grid,
	  y: getRandomInt(0, canvas.height/grid) * grid,
	  sx: grid-1,
	  sy: grid-1
	};
	
	var Speeder = {
	  x: getRandomInt(0, canvas.width/grid) * grid,
	  y: getRandomInt(0, canvas.height/grid) * grid,
	  sx: grid-1,
	  sy: grid-1
	};
	
	var invi = {
	  x: getRandomInt(0, canvas.width/grid) * grid,
	  y: getRandomInt(0, canvas.height/grid) * grid,
	  sx: grid-1,
	  sy: grid-1
	};
	// get random whole numbers in a specific range
	// @see https://stackoverflow.com/a/1527820/2124254
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}
	
	
	function reset() {
	  		snake.x = grid*10;
	        snake.y = grid*10;
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
			
	        apple.x = getRandomInt(0, canvas.width/grid) * grid;
	        apple.y = getRandomInt(0, canvas.height/grid) * grid;
	        goldO.x = getRandomInt(0, canvas.width/grid) * grid;	
	        goldO.y = getRandomInt(0, canvas.height/grid) * grid;
	        portalIN.x = getRandomInt(0, canvas.width/grid) * grid;
	        portalIN.y = getRandomInt(0, canvas.height/grid) * grid;
	        portalOut.x = getRandomInt(0, canvas.width/grid) * grid;
	        portalOut.y = getRandomInt(0, canvas.height/grid) * grid;
	        Speeder.x = getRandomInt(0, canvas.width/grid) * grid;
	        Speeder.y = getRandomInt(0, canvas.height/grid) * grid;
	}
	
	
	
	// game loop
	function loop() {
	  requestAnimationFrame(loop);
		
	  // slow game loop to 15 fps instead of 60 (60/15 = 4)
	  if (++count < speedOfSnake) {
	    return;
	  }
	
	  count = 0;
	  context.clearRect(0,0,canvas.width,canvas.height);
	  
	  // move snake by it's velocity
	  snake.x += snake.dx;
	  snake.y += snake.dy;
	
	  // wrap snake position horizontally on edge of screen
	  
	  if (snake.x < 0) {
		snake.x = canvas.width;
	  } else if (snake.x > canvas.width) {
	    snake.x = 0;
	  }

		  // wrap snake position vertically on edge of screen
	  if (snake.y < 0) {
			snake.y = canvas.height;
	  }
 	 
	  else if (snake.y > canvas.height) {
   	 	snake.y = 0;
	  }
	  // keep track of where snake has been. front of the array is always the head
	  snake.cells.unshift({x: snake.x, y: snake.y});
	  
	  // remove cells as we move away from them
	  if (snake.cells.length > snake.maxCells) {
	    snake.cells.pop();
	  }
	
	  // draw apple
	  context.fillStyle = 'red';
	  context.fillRect(apple.x, apple.y, apple.sx, apple.sy);
	  
	  // draw invincible pickup
	  if (goldCount >= InvinciC) {
	  	context.fillStyle = 'orange';
	  	context.fillRect(invi.x, invi.y, grid-1, grid-1);
	  }
	  // draw goldO
	  if (sCount >= PFgold){
	  	context.fillStyle = 'yellow';
	  	context.fillRect(goldO.x, goldO.y, grid-1, grid-1);
	  }
	  
	  
	  if (score > 10){
	  	// draw portalIn
	  	context.fillStyle = PortalColorIn[getRandomInt(0,4)];
	  	context.fillRect(portalIN.x, portalIN.y, grid-1, grid-1);
	  
	  	// draw portalOut
	  	context.fillStyle = PortalColorOut[getRandomInt(0,4)];
	  	context.fillRect(portalOut.x, portalOut.y, grid-1, grid-1);
	  }
	  // draw Speeder
	  if (gold >= SpeederCost) {
	  	context.fillStyle = SpeederColor[getRandomInt(0,4)];
	  	context.fillRect(Speeder.x, Speeder.y, grid-1, grid-1);
	  }
	  
	  // draw snake one cell at a time
	  context.fillStyle = 'green';
	  snake.cells.forEach(function(cell, index) {
	
	    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
	    context.fillRect(cell.x, cell.y, snake.sx, snake.sy);
		
	    // snake ate apple
	    if (apple.x < snake.x + snake.sx && apple.x + apple.sx > snake.x && apple.y < snake.y + snake.sy && apple.y + apple.sy > snake.y) {
	      snake.maxCells = Math.ceil(snake.maxCells/2);
		  snake.cells.length = Math.ceil(snake.cells.length/2);
		  score++;
		  sCount++;
		  
	      // canvas is 400x400 which is 25x25 grids
	      apple.x = getRandomInt(0, canvas.width/grid) * grid;
	      apple.y = getRandomInt(0, canvas.height/grid) * grid;
	    }
	    
	    if (score > 10){
	    //Snake goes in portalIN
		    if (cell.x === portalIN.x && cell.y === portalIN.y) {
		      snake.x = portalOut.x;
		      snake.y = portalOut.y;
		      snake.dx *= -1; 
	    	  snake.dy *= -1;
		      // canvas is 400x400 which is 25x25 grids
		      
	    	  	portalIN.x = getRandomInt(0, canvas.width/grid) * grid;
	      		portalIN.y = getRandomInt(0, canvas.height/grid) * grid;
	    	}
	    	//Snake goes in portalOut
	    	if (cell.x === portalOut.x && cell.y === portalOut.y) {
	      		snake.x = portalIN.x;
		      	snake.y = portalIN.y;
		      	snake.dx *= -1; 
	    	  	snake.dy *= -1; 
	      		// canvas is 400x400 which is 25x25 grids
	      		portalOut.x = getRandomInt(0, canvas.width/grid) * grid;
	      		portalOut.y = getRandomInt(0, canvas.height/grid) * grid;
	    	}
	    }
	    
	    //Snake collects Speeder
	    if (gold >= SpeederCost) {
		    if (cell.x === Speeder.x && cell.y === Speeder.y) {
		      gold = Math.abs(gold-SpeederCost);
		      if ((originalSpeed == speedOfSnake) == false){
		      	speedOfSnake = speedOfSnake-3;
		      } else if ((originalSpeed == speedOfSnake) == true){
		      	speedOfSnake = speedOfSnake+3;
		      }
		      Speeder.x = getRandomInt(0, canvas.width/grid) * grid;
		      Speeder.y = getRandomInt(0, canvas.height/grid) * grid;
		    }
	    }
	    
	    // snake ate gold
	    if (sCount >= PFgold){
	    	if (cell.x === goldO.x && cell.y === goldO.y) {
	    		sCount -= PFgold;
	    		goldCount++;
	    		gold++;
	    		
	    		var checkRTF = getRandomInt(0,10);
	    	
	    		if (checkRTF == 10){
	      			snake.maxCells = Math.ceil(snake.maxCells/2);
				  	snake.cells.length = Math.ceil(snake.cells.length/2);
		  			score = Math.ceil(score/2);
				} else if (checkRTF == 5){
		  		  	snake.maxCells = snake.maxCells+snake.maxCells; 
		  		  	score *= 2;
				} else {
		  			snake.maxCells++;
		  			snake.maxCells++;
		  			score++;
		  			score++;
				}
	      		// canvas is 400x400 which is 25x25 grids
	      		goldO.x = getRandomInt(0, canvas.width/grid) * grid;
	      		goldO.y = getRandomInt(0, canvas.height/grid) * grid;
	    	}
		}
		
		// snake collect invincible powerup
		if (cell.x === invi.x && cell.y === invi.y && goldCount >= InvinciC) {
	      Icharge = Icharge + getRandomInt(1,5);
	      goldCount = (goldCount - InvinciC);
	      invi.x = getRandomInt(0, canvas.width/grid) * grid;
	      invi.y = getRandomInt(0, canvas.height/grid) * grid;
		}
	    // check collision with all cells after this one (modified bubble sort)
	    for (var i = index + 1; i < snake.cells.length; i++) {
	      // snake occupies same space as a body part. reset game
	      if (invincible.is == false) {
	      	if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
	        	reset();
	      	}
	      }
	    }
	    // test for invincibility, count frames, and remove after a time.
	    if (invincible.is == true) {
	    	invincible.frames++;
	    }
	    // bases time off of length of snake, longer the snake longer the time for invinciblity
	    if (invincible.frames > ((10 * speedOfSnake) * snake.cells.length)) {
	    	invincible.is = false;
	    	invincible.frames = 0;
	    }
	    
	  });
	  document.getElementById("ScoreBoard").innerHTML = (" Score: " + score + " gold: " + goldCount + " x: " + snake.x + " y: " + snake.y);
	  if (Icharge > 0) {
	  	document.getElementById("ScoreBoard").innerHTML = document.getElementById("ScoreBoard").innerHTML + " Charges: ";
	  	for (var i = 0; i < Icharge; i++){
	  		document.getElementById("ScoreBoard").innerHTML = document.getElementById("ScoreBoard").innerHTML + "|";
	  	}
	  }
	  
	  if (invincible.is == true) {
	  	document.getElementById("ScoreBoard").innerHTML = document.getElementById("ScoreBoard").innerHTML + " iframes: " + (((10 * speedOfSnake) * snake.cells.length) - invincible.frames);
	  }
	}
		
	// listen to keyboard events to move the snake
	document.addEventListener('keydown', function(e) {
	  // prevent snake from backtracking on itself by checking that it's not already moving on the same axis 
		  // left arrow key
		  if (e.which === 37 && snake.dx === 0) {
		    snake.dx = -grid;
		    snake.dy = 0;
		  }
		  // up arrow key
		  else if (e.which === 38 && snake.dy === 0) {
		    snake.dy = -grid;
		    snake.dx = 0;
		  }
		  // right arrow key
		  else if (e.which === 39 && snake.dx === 0) {
		    snake.dx = grid;
		    snake.dy = 0;
		  }
		  // down arrow key
		  else if (e.which === 40 && snake.dy === 0) {
		    snake.dy = grid;
		    snake.dx = 0;
		  } else if (e.which === 32 && invincible.is === false && Icharge > 0 && goldCount >= InvinciC) {
		  // apply invincibility
		   	Icharge--;
		  	invincible.frames = 10;
		  	invincible.is = true;
		  }
	});
	
	document.querySelector('body').addEventListener('contextmenu', function(event) {event.preventDefault();});
	
	// start the game
	if(start = true){
		requestAnimationFrame(loop);
	}