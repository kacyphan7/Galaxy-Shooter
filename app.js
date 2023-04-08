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
  const movement = document.getElementById('movement');
  movement.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      player.x += 10; // Move player right
    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      player.x -= 10; // Move player left
    } else if (event.code === 'Space') {
      console.log('Space key pressed'); 
      // Shoot bullet
    }
  });
  setInterval(gameLoop, 60);
});

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

game.focus();

// ====================== Define the Alien class ======================= //
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

// add class player with playerImg
class Player {
  constructor(playerImg, x, y) {
    this.image = playerImg;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.dx = 0; // horizontal speed
    this.dy = 0; // vertical speed
    this.speed = 5; // movement speed
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
    let bullet = new Bullet(this.x + this.width / 2, this.y);
    bulletList.push(bullet);
  }

  handleKeyDown(event) {
    // Handle player movement and firing
    if (event.key === "ArrowLeft") {
      this.dx = -this.speed;
    }
    if (event.key === "ArrowRight") {
      this.dx = this.speed;
    }
    if (event.key === "ArrowUp") {
      this.dy = -this.speed;
    }
    if (event.key === "ArrowDown") {
      this.dy = this.speed;
    }
    if (event.key === " ") {
      this.fireBullet();
    }
  }

  handleKeyUp(event) {
    // Stop player movement
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      this.dx = 0;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      this.dy = 0;
    }
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

//game loop
function gameLoop() {
  //clear canvas
  ctx.clearRect(0, 0, width, height);
  // draw player ship 
    player.draw();

  // Update and draw aliens
  for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    alien.update();
    alien.draw();

    if (alien.y + alien.height > height) {
      // Create new row of aliens
      let newRow = createAlienRow(50, 50, 5);
        alienList = alienList.concat(newRow);
        break; // Exit loop to avoid adding duplicates
      }
    }
    
   // Update and draw the bullets fired by the player
   if (bullet) {
    bullet.update();
    bullet.draw();
  }

  // Update and draw the bullets fired by the aliens
  for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    for (let j = 0; j < alien.bulletList.length; j++) {
      let alienBullet = alien.bulletList[j];
      alienBullet.update();
      alienBullet.draw();
    }
  }

  // Check for collisions
  for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    if (bullet && alien.checkCollisionWithBullet(bullet)) {
      bullet = null; // Player bullet is destroyed
      break;
    }
  }

  // Check for collisions between player and alien bullets
  for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    for (let j = 0; j < alien.bulletList.length; j++) {
      let alienBullet = alien.bulletList[j];
      if (alienBullet && alien.checkCollisionWithBullet(bullet)) {
        alien.bulletList.splice(j, 1); // Remove the alien bullet if it hits the player
        break;
      }
    }
  
  }
}
   // Update the score
   /* if (status) {
    status.innerHTML = "Score: " + score.innerHTML;
  }
   // Check if the game is over
   if (alienList.length === 0) {
     status.innerHTML = "You Win!";
     clearInterval(gameInterval);
   } else if (alienList[alienList.length - 1].y + alienList[alienList.length - 1].height > height - ship.height) {
     status.innerHTML = "Game Over";
     clearInterval(gameInterval);
   }
} */