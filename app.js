const game = document.getElementById('game');
const movement = document.getElementById('movement');
const score = document.getElementById('score');
const status = document.getElementById('status');
const ctx = game.getContext('2d');
const width = game.width;
const height = game.height;

let ship;
let alien;
let bullet;

// ====================== Load the images ======================= //
const playerImg = new Image();
playerImg.src = './Img/spaceShip-yellow-blue.png';
const alienImage = new Image();
alienImage.src = './Img/alien-cyberBlade.png';
const bulletImg = new Image();
bulletImg.src = './Img/bullets.png';

// ====================== main event listener ======================= //
window.addEventListener('DOMContentLoaded', function() {
  player = new Player(playerImg, width / 2 - 25, height - 75);


  setInterval(gameLoop, 60);
});

document.addEventListener('keydown', movePlayer); 

// ====================== ENTITIES ======================= //
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.color = "blue";
    this.dy = 5; // vertical speed
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#7CE7EE";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.y += this.dy;
  }
}

/***************** add class alien with alienImage **********************/

class Alien {
  constructor(alienImage, x, row) {
    this.image = alienImage;
    this.x = x;
    this.y = row * 60 + 50;
    this.width = 50;
    this.height = 50;
    this.dx = 1; // horizontal speed
    this.dy = 50; // vertical speed
    this.lives = 1;
    this.canDuplicate = true;
    this.bulletList = [];
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
     // Draw the bullets fired by the alien
     for (let i = 0; i < this.bulletList.length; i++) {
      let bullet = this.bulletList[i];
      bullet.draw();
    }
  }

  update() {
    this.x += this.dx;

     // Check if alien has reached left or right end of screen
     if (this.x + this.width > width || this.x < 0) {
      this.dx = -this.dx; // reverse horizontal direction
      this.y += this.dy; // move down
    }

    // Check if the first row of aliens has reached the middle of the screen
    if (this.y + this.height >= height/2 && this.canDuplicate) {
      // Duplicate into a new row of aliens
      for (let i = 0; i < 5; i++) {
        let newAlien = new Alien(this.image, 50 + i * 100, 50);
        newAlien.canDuplicate = false;
        alienList.push(newAlien);
      }
    }

    // Fire a bullet randomly
    if (Math.random() < 0.005) {
      this.fireBullet();
    }

    // Update the bullets fired by the alien
    for (let i = 0; i < this.bulletList.length; i++) {
      let bullet = this.bulletList[i];
      bullet.update();
      if (bullet.y > height) {
        this.bulletList.splice(i, 1); // Remove the bullet if it goes out of screen
      }
    }
  }

  fireBullet() {
    let bullet = new Bullet(this.x + this.width/2, this.y + this.height, 1); // Create a new bullet at the center of the alien
    this.bulletList.push(bullet); // Add the bullet to the list of bullets fired by the alien
  }

  checkCollisionWithBullet(bullet) {
    if (!bullet) {
      return false;
    }
    return (
      bullet.x < this.x + this.width &&
      bullet.x + bullet.width > this.x &&
      bullet.y < this.y + this.height &&
      bullet.y + bullet.height > this.y
    );
  }
  

  destroy() {
    if (this.canDuplicate) {
      // Duplicate into two new aliens
      let newAlien1 = new Alien(this.image, this.x, this.y);
      newAlien1.canDuplicate = false;
      let newAlien2 = new Alien(this.image, this.x, this.y);
      newAlien2.canDuplicate = false;
      alienList.push(newAlien1);
      alienList.push(newAlien2);
    }
    // Remove current alien from list
    let index = alienList.indexOf(this);
    if (index !== -1) {
      alienList.splice(index, 1);
    }
    // Increase score
    score.innerHTML = parseInt(score.innerHTML) + 100;
  }
}

// create array of aliens to add a row of aliens 
let alienList = [];
for (let i = 0; i < 5; i++) {
  let alien = new Alien(alienImage, i * 60 + 50, 0);
  alienList.push(alien);
}
// function to add new row of alien in loop when reach bottom of the screen 
function createAlienRow(startX, startY, numAliens) {
  let aliens = [];

  for (let i = 0; i < numAliens; i++) {
    let alien = new Alien(alienImage, startX + i * 60, startY);
    aliens.push(alien);
  }

  return aliens;
}

/***************** add class player with playerImg **********************/
class Player {
  constructor(playerImg, x, y) {
    this.image = playerImg;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.dx = 0; // horizontal speed
    this.dy = 0; // vertical speed
    this.speed = 20; // movement speed
    this.bulletList = [];
    this.playerBullets = [];
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
     // Draw the bullets fired by the player
     for (let i = 0; i < this.bulletList.length; i++) {
      let bullet = this.bulletList[i];
      bullet.draw();
    }
  }

  update() {
    // Move player
    this.x += this.dx;
    this.y += this.dy;

    // Prevent player from moving off screen
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > width) {
      this.x = width - this.width;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.height > height) {
      this.y = height - this.height;
    }
  }

  fireBullet() {
    // Create new bullet
    let bullet = new Bullet(this.x + this.width/2, this.y, -5); // Create a new bullet at the center of the player and move it upwards
    playerBullets.push(bullet); // Add the bullet to the list of player bullets
  }

  checkCollisionWithAlien(alien) {
    if (this.x < alien.x + alien.width &&
        this.x + this.width > alien.x &&
        this.y < alien.y + alien.height &&
        this.y + this.height > alien.y) {
      return true;
    }
    return false;
  }
}

// Create player object
let player = new Player(playerImg, width / 2 - 25, height - 75);

// declare bulletlist array 
let bulletList = [];
let playerBullets = [];

// ====================== KEYBOARD LOGIC  ======================= //
window.addEventListener('keydown', movePlayer);

function movePlayer(e) {
  console.log('movement :', e.key);

  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.dx = -player.speed;
  } else if (e.key === 'ArrowUp' || e.key === 'w') {
    player.dy = -player.speed;
  } else if (e.key === 'ArrowDown' || e.key === 's') {
    player.dy = player.speed;
  } else if (e.key === ' ') {
    player.fireBullet();
  }
}

// Add key up event listener
document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.dx = 0;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.dx = 0;
  } else if (e.key === 'ArrowUp' || e.key === 'w') {
    player.dy = 0;
  } else if (e.key === 'ArrowDown' || e.key === 's') {
    player.dy = 0;
  } 
});

// ====================== GAME PROCESSES ======================= //

function gameLoop() {
  //clear canvas
  ctx.clearRect(0, 0, width, height);
  // draw player ship 
    player.update();
    player.draw();

   // Update and draw the aliens
   for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    alien.update();
    alien.draw();
  }

  // Update and draw the player bullets
  for (let i = 0; i < playerBullets.length; i++) {
    let bullet = playerBullets[i];
    bullet.update();
    bullet.draw();
    // Remove the bullet if it goes out of screen
    if (bullet.y < 0) {
      playerBullets.splice(i, 1);
      i--;
    }
  }

  // Check for collisions between player bullets and aliens
  for (let i = 0; i < playerBullets.length; i++) {
    let bullet = playerBullets[i];
    for (let j = 0; j < alienList.length; j++) {
      let alien = alienList[j];
      if (alien.checkCollisionWithBullet(bullet)) {
        bullet.destroy();
        alien.destroy();
        i--;
        break;
      }
    }
  }

  // Check for collisions between player and aliens
  for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    if (player.checkCollisionWithAlien(alien)) {
      player.destroy();
      //status.innerHTML = 'Game Over';
      return;
    }
  }
  game.focus();
}