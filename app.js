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
const shipImg = new Image();
shipImg.src = './Img/spaceShip-yellow-blue.png';
const alienImage = new Image();
alienImage.src = './Img/alien-cyberBlade.png';
const bulletImg = new Image();
bulletImg.src = './Img/bullets.png';

// ====================== main event listener ======================= //
window.addEventListener('DOMContentLoaded', function() {
  const movement = document.getElementById('movement');
  movement.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    console.log('Right arrow or D key pressed'); 
      // Move player right
    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      console.log('Left arrow or A key pressed');
      // Move player left
    } else if (event.code === 'Space') {
      console.log('Space key pressed'); 
      // Shoot bullet
    }
  });
  setInterval(gameLoop, 60);
});

// ====================== Define the Alien class ======================= //
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
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.dx;

    // Check if alien has reached left or right end of screen
    if (this.x + this.width > width || this.x < 0) {
      this.dx = -this.dx; // reverse horizontal direction
      this.y += this.dy; // move down
    }
  }

  checkCollisionWithBullet(bullet) {
    if (bullet.x < this.x + this.width &&
        bullet.x + bullet.width > this.x &&
        bullet.y < this.y + this.height &&
        bullet.y + bullet.height > this.y) {
      this.lives--;
      if (this.lives <= 0) {
        this.destroy();
      }
      return true;
    }
    return false;
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

// create array of aliens to add rows of aliens 
let alienList = [];
for (let i = 0; i < 5; i++) {
  let alien = new Alien(alienImage, i * 60 + 50, 0);
  alienList.push(alien);
}

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  // Update and draw aliens
  for (let i = 0; i < alienList.length; i++) {
    let alien = alienList[i];
    alien.update();
    alien.draw();
  }
  // Update and draw player
  player.update();
  player.draw();
  // Update and draw bullets
  for (let i = 0; i < bulletList.length; i++) {
    let bullet = bulletList[i];
    bullet.update();
    bullet.draw();
  }
}

// ================= Class Player  ======================== //
class Player {
  constructor(shooterImage) {
      this.image = shooterImage;
      this.x = width / 2;
      this.y = height -30;
      this.isMovingLeft = false;
      this.isMovingRight = false;
      this.bullets = [];
  }
}
