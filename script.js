// Game Variables
let gameStarted = false; // Delay start until user clicks
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Bird
const bird = {
  x: 50,
  y: 150,
  radius: 15,
  gravity: 0.5,
  lift: -8,
  velocity: 0,
};

// Bird Image
let birdImg = new Image();
birdImg.src = "./bird.png";

// Background Image
let bgImg = new Image();
bgImg.src = "./background.png";

// Game State
let gameOver = false;

// Pipe Variables
let pipes = [];
let pipeWidth = 40;
let pipeGap = 120;
let pipeSpeed = 2;
let score = 0;

// Restart Button
const restartBtn = document.getElementById("restartBtn");

// Reset Game
function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  gameStarted = false; // Reset gameStarted to false
  restartBtn.style.display = "none"; // Hide the button on restart
  requestAnimationFrame(gameLoop);
}

// Draw Background
function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

// Draw Bird
function drawBird() {
  ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, 30, 30);
}

// Update Bird Position
function updateBird() {
  if (gameStarted) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
  }

  // Prevent bird from going off the top
  if (bird.y - bird.radius < 0) {
    bird.y = bird.radius;
    bird.velocity = 0;
  }

  // Game over if bird hits the ground
  if (bird.y + bird.radius >= canvas.height) {
    gameOver = true;
    showGameOver();
  }
}

// Draw Pipes
function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];

    // Draw top pipe
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

    // Draw bottom pipe
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

    // Move pipe to the left
    pipe.x -= pipeSpeed;

    // Check for collision
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipeWidth &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottomY)
    ) {
      gameOver = true;
      showGameOver();
    }

    // Remove pipes if they go off the screen
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++; // Increment score when pipe passes
    }
  }
}

// Add New Pipes
function addPipe() {
  if (gameStarted) {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 30;
    let gap = pipeGap;

    pipes.push({
      x: canvas.width,
      top: pipeHeight,
      bottomY: pipeHeight + gap,
    });
  }
}

// Draw Score
function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "18px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

// Show Game Over Text & Button
function showGameOver() {
  ctx.fillStyle = "#FF0000";
  ctx.font = "20px Arial";
  ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2 - 20);
  restartBtn.style.display = "block"; // Show restart button
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  if (!gameStarted) {
    drawBird();
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Click to Start!", canvas.width / 4, canvas.height / 2);
    requestAnimationFrame(gameLoop);
    return; // Stop game loop until the game starts
  }

  // Draw bird, pipes, and score
  drawBird();
  updateBird();
  drawPipes();
  drawScore();

  // Stop game if game over
  if (gameOver) {
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Handle Mouse Click for Bird Jump and Start Game
canvas.addEventListener("mousedown", function () {
  if (!gameStarted) {
    gameStarted = true; // Start the game on first click
    bird.velocity = bird.lift; // Give bird an initial lift on first click
  } else if (!gameOver) {
    bird.velocity = bird.lift; // Bird jumps when mouse is clicked
  }
});

// Handle Button Click to Restart Game
restartBtn.addEventListener("click", resetGame);

// Start the Game and Add Pipes Every 2 Seconds
window.onload = () => {
  gameLoop(); // Start the game loop
  setInterval(addPipe, 2000); // Add pipes every 2 seconds
};
