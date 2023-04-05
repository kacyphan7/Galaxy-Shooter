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

// Load the images
const shipImg = new Image();
shipImg.src = './Img/spaceShip-yellow-blue.png';
const alienImage = new Image();
alienImage.src = './Img/alien-cyberBlade.png';
const bulletImg = new Image();
bulletImg.src = './Img/bullets.png';

// Define the Alien class
class Alien {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  draw() {
    ctx.save(); // save the current state of the canvas
    ctx.translate(this.x, this.y); // move the canvas to the position of the alien
    //ctx.rotate(Math.PI / -2); // rotate the canvas 90 degrees
    ctx.drawImage(this.image, 0, 0, this.image.width / 30, this.image.height / 30); // draw the image at the origin (0,0)
    ctx.restore(); // restore the canvas to its previous state
  }
}

// Draw the images onto the canvas
alienImage.onload = function () {
  alien = new Alien(100, 100, alienImage);
  // Draw the alien on the canvas
  alien.draw();
}; 

// Add Enemy Class, create constructor, make alien move down on grid 
class Enemy {
  constructor(alienImage, columnCount) {
      this.alienImage = alienImage;
      this.columnCount = columnCount;
      this.direction = 0;
      this.x = 10;
      this.y = 10;
      this.aliens = this.initAliens(height);
      this.bullets = [];
  
      this.speed = 0.2;
  }
  // update position of aliens and move them down if they've reached the edge of the screen 
  update() {
      for (let alien of this.aliens) {
          if (this.direction == 0) {
              alien.x+= this.speed;
          } else if (this.direction == 1) {
              alien.x-= this.speed;
          }
      }
 
      if (this.changeDirection()) {
          this.alienMoveDown();
      }
      
  } // check if aliens reached edge of the screen and changed their direction
  changeDirection() {
      for (let alien of this.aliens) {
          if (alien.x >= width - 40) {
              this.direction = 1;
              return true;
          } else if (alien.x <= 20) {
              this.direction = 0;
              return true;  // true if alien turn direction 
          }
      }
      return false; 
  }
  alienMoveDown() {
      for (let alien of this.aliens) {
          alien.y += 10; // move aliens down by 10 pixels
      }
  }
  // Initializes the aliens and positions them in rows // move functoin play with height; push w to top for column down
  initAliens() {
    let aliens = [];
    let y = 12;
        for (let i = 0; i < this.columnCount; i++) {
            for (let x = 30; x < width - 150; x += 20) {
                aliens.push(new Alien(x, y, this.alienImage));
            }
            y += 13;
        }
    return aliens;
  }

  // draw all aliens on the canvas
  draw() {
      for (let alien of this.aliens) {
          alien.draw();
      }
  }

}

alienImage.onload = function () {
  const enemy = new Enemy(alienImage, 10);
  // Draw the aliens on the canvas
  enemy.draw();
}; 

// check for collision and removing aliens 
/* collison(x, y) {
  for (let i = this.aliens.length - 1; i >= 0; i--) {
    let alienAlive = this.aliens[i];
      if (distance(x, y, alienAlive.x + 11.5, alienAlive.y + 8) < 10) {
        this.aliens.splice(i, 1);
      }
    }
  return false;  
} */