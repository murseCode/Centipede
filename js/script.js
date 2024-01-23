const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.width = 20;
    this.height = 20;
    this.speed = 5;
    this.direction = 0;
  }

  move() {
    this.x += this.direction * this.speed;
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.width)); // Keep player within bounds
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 7;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class CentipedeSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.speed = 2;
    this.direction = 1;
    this.hits = 0;
    this.requiredHitsToDestroy = 5;
  }

  update() {
    this.x += this.direction * this.speed;
    if (this.x <= 0 || this.x + this.width >= canvas.width) {
      this.direction *= -1;
      this.y += this.height; // Move down when hitting wall
    }
    if (this.hits >= this.requiredHitsToDestroy) {
        return true; // Indicates the centipede segment is destroyed
      }
      return false;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class PowerUp {
    constructor(type, x, y) {
      this.type = type;
      this.x = x;
      this.y = y;
      this.width = 20;
      this.height = 20;
      this.speed = 2;
    }
  
    update() {
      this.y += this.speed;
    }
  
    draw() {
      if (this.type === 'size') {
        ctx.fillStyle = 'blue';
      } else if (this.type === 'speed') {
        ctx.fillStyle = 'purple';
      } else if (this.type === 'explosive') {
        ctx.fillStyle = 'red';
      }
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

Player.prototype.applyPowerUp = function(type) {
    if (type === 'size') {
      this.width *= 2; // Increase size
    } else if (type === 'speed') {
      this.speed *= 2; // Increase player speed
    } else if (type === 'explosive') {
      this.explosiveBullets = true; // Activate explosive bullets
    }
    setTimeout(() => this.resetPowerUp(type), 6000); // Reset after 6 seconds
  };
  
  Player.prototype.resetPowerUp = function(type) {
    if (type === 'size') {
      this.width /= 1.5;
    } else if (type === 'speed') {
      this.speed /= 2;
    } else if (type === 'explosive') {
      this.explosiveBullets = false;
    }
  };

let player = new Player();
let bullets = [];
let centipede = [];
let powerUps = [];
let gameOver = false;
let requiredHitsToDestroy = 100; // Set this to the required number of hits
let currentHits = 0; // Track the current number of hits
let gameWon = false;
let currentLevel = 1;
let speedIncrement = 1;



// Create initial centipede

//function createCentipede() {
    for (let i = 0; i < 10; i++) {
  centipede.push(new CentipedeSegment(i * 20, 0));
}
//centipede.speed += speedIncrement;

//} 

function spawnPowerUp() {
    const types = ['size', 'speed', 'explosive'];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * (canvas.width - 20);
    powerUps.push(new PowerUp(type, x, 0));
    setTimeout(spawnPowerUp, 10000); // Spawn a power-up every 10 seconds
  }

  spawnPowerUp();

function handleInput(event) {
  if (event.key === 'ArrowLeft') {
    player.direction = -1;
  } else if (event.key === 'ArrowRight') {
    player.direction = 1;
  } else if (event.key === ' ') {
    bullets.push(new Bullet(player.x + player.width / 2, player.y));
  }
}

function stopPlayer(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    player.direction = 0;
  }
}
function collision(obj1, obj2) {
    // Collision detection logic
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.height + obj1.y > obj2.y;
}

function checkGameOver() {
    document.addEventListener('keydown', event => {
        if (gameOver && event.code === 'Space') {
          restartGame();
        }
      });
    return gameOver;
}

function nextLevel() {
    currentLevel++;
    restartGame();
}

function checkGameWon() {
    
        nextLevel();
    
}



function restartGame() {
    // Reset game state
//console.log("restarting");
    //$("#level-title").text("Level 5");

    
    if (currentLevel > 1) {
        ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText('Level ' + (currentLevel - 1) + ' Won', 320, canvas.height / 2);
      //ctx.fillText('\n Press SpaceBar to move to next level', 150, 500);
    } 
    
    player = new Player();
    bullets = [];
    centipede = [];
    powerUps = [];
    //pellets = [];
    //spawnCentipede(); // Function to spawn a new centipede
    spawnPowerUp();
    //spawnPellets();
    gameOver = false;
    gameWon = false;
    //animate();
}

document.addEventListener('keydown', handleInput);
document.addEventListener('keyup', stopPlayer);
/*
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && (gameOver || gameWon) === true) {
      console.log('Space bar pressed');
      checkGameWon();
    }
  });
*/

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move();
  player.draw();
  

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    bullets[i].draw();
    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < centipede.length; i++) {
    centipede[i].update();
    centipede[i].draw();
  }

  for (let i = 0; i < powerUps.length; i++) {
    powerUps[i].update();
    powerUps[i].draw();
    // Collision detection between bullets and power-ups
    for (let j = 0; j < bullets.length; j++) {
      if (collision(bullets[j], powerUps[i])) {
        player.applyPowerUp(powerUps[i].type);
        powerUps.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
}

for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < centipede.length; j++) {
      if (collision(bullets[i], centipede[j])) {
        // Collision logic
        bullets.splice(i, 1); // Remove the bullet
        currentHits += 1; // Reduce centipede segment's health or remove it
        // Check if the centipede segment should be destroyed
        if (currentHits >= requiredHitsToDestroy) {
            gameWon = true;
            checkGameWon();
            // press space to enter new level where speed of centipede is increased
            return;
        }
        break; // Exit the inner loop if a collision is found
      }
    }
  }


    if (checkGameOver()) {
      // Display game over message
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.fillText('Game Over! Press Space to Restart', canvas.width / 4, canvas.height / 2);
    }
  

  requestAnimationFrame(animate);

}

animate();
