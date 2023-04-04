const game = document.getElementById('game');
const movement = document.getElementById('movement');
const score = document.getElementById('score');
const status = document.getElementById('status');
const ctx = game.getContext('2d');
let ship;
let alien;

// Load the images
const shipImg = new Image();
shipImg.src = './Img/spaceShip-yellow-blue.png';
const alienImage = new Image();
alienImage.src = './Img/alien-cyberBlade.png';

// Define the Alien class
class Alien {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.image.width / 30, this.image.height / 30);
  }
}

// Draw the images onto the canvas
alienImage.onload = function () {
  alien = new Alien(100, 100, alienImage);
  // Draw the alien on the canvas
  alien.draw();
};

