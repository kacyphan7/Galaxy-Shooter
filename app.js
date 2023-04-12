const canvas = document.getElementById('game');
const movement = document.getElementById('movement');
const score = document.getElementById('score');
const status = document.getElementById('status');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

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
window.addEventListener('DOMContentLoaded', function () {
  player = new Player(playerImg, width / 2 - 25, height - 75);
  /* inside DOM a new instance of Player obeject is created and assigned to the variable 'player' w/3 constructor
  playerImg, x coordinate of player's starting position, and y coordinate of player's starting position. 
  x coordinate is calculated as 'width / 2- 25, which centers the player horizontally. y coordinate is calculated 
  as 'height-75', which poistion player near bottom of the screen. 
  */

  setInterval(gameLoop, 60); //gameLoop is called ever 60 milliseconds, purpose is to update the game state & render the new state 
});

document.addEventListener('keydown', movePlayer); //event is fired when a key on the keyboard is pressed down, function movePlayer is called

// ====================== ENTITIES ======================= //
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 5;
    this.color = "yellow";
    this.dy = 15; // vertical speed
  }

  draw() { // draw bullet on canvas using properties defined in the constructor 
    ctx.beginPath();
    ctx.fillStyle = "#DEFA69";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }

  update() { // updates the bullet's position by adding its vertical speed to its current position
    this.y += this.dy;
  }

  destroy() { // method to removes the bullet from the list of active bullets 
    let index = bulletList.indexOf(this);
    if (index !== -1) {
      bulletList.splice(index, 1);
    }
  }
}

class PlayerBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 5;
    this.color = "blue";
    this.dy = 15; // vertical speed
  }

  draw() { // <- responsible for rendering the bullet on canvas. 
    ctx.beginPath(); // <- method of the ctx object; reference to the canvas context 
    ctx.fillStyle = '#4FFFF6';
    ctx.rect(this.x, this.y, this.width, this.height); // <- create a rectangle using rect() 
    ctx.fill();
    ctx.closePath(); // close path 
  }

  update2() {
    this.y -= this.dy;
  }

  destroy() {
    // Remove bullet from list of active bullets
    let index = playerBulletList.indexOf(this);
    if (index !== -1) {
      playerBulletList.splice(index, 1);
    }
  }
}

/***************** add class alien with alienImage **********************/
class Alien {
  constructor(alienImage, x, rowCount) {
    this.image = alienImage;
    this.x = x;
    this.y = rowCount; // row that alien belongs to 
    this.width = 50;
    this.height = 50;
    this.dx = 5; // horizontal speed
    this.dy = 50; // vertical speed
    this.lives = 1;
    this.bulletList = [];
  }

  draw() { // <- responsible for drawing the alien and bullets that alien has fired on canvas 
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    // Draw the bullets fired by the alien
    for (let bullet of this.bulletList) {
      bullet.draw();
    }
  }
  /* update method is resposible for updating the alien's position on the screen, checking if it has reached the 
  end of the screen or the bottom of the screen, firing bullets randomly, and updating the bullets fired by
  the alien. The method also checks for collisions between the alien's bullets and the player's bullets,
  and destroys the alien and the player's bullet in case of a collision.
  */
  update() {
    this.x += this.dx;

    // Check if alien has reached left or right end of screen
    if (this.x + this.width > width || this.x < 0) {
      this.dx = -this.dx; // reverse horizontal direction
      this.y += this.dy; // move down
    }

    // Check if alien has reached bottom of screen
    if (this.y + this.height >= height) {
      endGame(); // Call function to end the game
    }

    // Fire a bullet randomly
    if (Math.random() < 0.005) {
      this.fireBullet();
    }

    // Update the bullets fired by the alien
    for (let i = this.bulletList.length - 1; i >= 0; i--) {
      let bullet = this.bulletList[i];
      bullet.update();
      let hit = detectHit(player, bullet);
      if (bullet.y > height) {
        this.bulletList.splice(i, 1); // Remove the bullet if it goes out of screen
      } else {
        // Check for collision with player bullets
        for (let j = player.bulletList.length - 1; j >= 0; j--) {
          let playerBullet = player.bulletList[j];
          if (this.checkCollisionWithBullet(playerBullet)) {
            // Remove player bullet and destroy alien
            player.bulletList.splice(j, 1);
            this.destroy();
          }
        }
      }
    }
  }

  fireBullet() { // creates a new bullet object at the center of an alien object and adds it to a list of bullet fired by the alien 
    let bullet = new Bullet(this.x + this.width / 2, this.y + this.height, 1);// Create a new bullet at the center of the alien
    this.bulletList.push(bullet); // Add the bullet to the list of bullets fired by the alien
  }

  checkCollisionWithBullet(bullet) { // checks if given bullet object collides with alien object. It returns 'true' if bullet overlaps with alien, and 'false' otherwise
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
  /* destroy() is called when an alien object is destroyed. It updates the player's score, createes two new alien object
  if the destroy alien had the 'canDuplicate' property set to 'true', removes the destroyed alien from the list of aliens. */
  destroy() {
    // Increase player score by alien's score
    player.score += 100;

    // Update score display on the webpage
    score.textContent = player.score;

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
  }
}

// create array of aliens to add a row of aliens 
let alienList = [];

// function to add new row of alien in loop when reach bottom of the screen 
function createAlienRow(startX, startY) { // startX, startY parameters indicate the position of the first alien in the row
  let aliens = [];

  for (let i = 0; i < 6; i++) {
    let alien = new Alien(alienImage, startX + i * 60, startY);
    aliens.push(alien);
  }

  return aliens;
}

// add first row every 5 seconds
setInterval(function () {
  let newAliens = createAlienRow(50, 0, 6);
  alienList = alienList.concat(newAliens);
}, 5000);

// add first row every 10 seconds
setInterval(function () {
  let newAliens = createAlienRow(50, 0, 6);
  alienList = alienList.concat(newAliens);
}, 10000);


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
    //this.playerBullets = [];
    this.alive = true;
    this.score = 0;
  }

  draw() { // draws player image and bullets on screen
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    // Draw the bullets fired by the player
    for (let i = 0; i < this.bulletList.length; i++) {
      let bullet = this.bulletList[i];
      bullet.draw();
    }
  }

  update() { // <- updates the position of player on scree, check if player is moving off screen and updates the bullets' positions
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

    // Update the bullets fired by the player
    for (let i = 0; i < this.bulletList.length; i++) {
      let bullet = this.bulletList[i];
      bullet.update2();
      if (bullet.y < 0) {
        this.bulletList.splice(i, 1); // Remove the bullet if it goes out of screen
      }
    }

  }

  fireBullet() { // create new bullet object and add it to the list of player bullets 
    let bullet = new PlayerBullet(this.x + this.width / 2, this.y, -5); // Create a new bullet at the center of the player and move it upwards
    //let bullet = new Bullet(this.x + this.width / 2, this.y + this.height, 1); 
    playerBullets.push(bullet); // Add the bullet to the list of player bullets
  }

  checkCollisionWithAlien(_alien) { // checks if a bullet has collided with an alien 
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

  destroy() { // <- decrements the player's position, speed, bullet list, and score 
    this.lives -= 1;
    if (this.lives <= 0) {
      // Game over
      console.log("Game over!");
    } else {
      // Reset player position and speed
      this.x = width / 2 - this.width / 2;
      this.y = height - 100;
      this.dx = 0;
      this.dy = 0;
    }
  }
  reset() { // restes the player's position, speed, bullet list, and score
    this.x = width / 2 - this.width / 2;
    this.y = height - 75;
    this.dx = 0;
    this.dy = 0;
    this.score = 0;
    this.bulletList = [];
    this.playerBullets = [];
  }
}


// Creates a new instance of the Player class and assigns it to the varibale named "player"
let player = new Player(playerImg, width / 2 - 25, height - 75);

// declare bulletlist array 
let bulletList = []; // create an empty array 
let playerBullets = [];
let playerBulletList = [];

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
document.addEventListener('keyup', function (e) {
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

// ====================== HELPER FUNCTIONS ======================= //
function addNewPlayer() {
  player.alive = false;
  // use setTimeout to create a new player after 1 second (1000 miliseconds)
  setTimeout(function () {
    player = new Player(playerImg);
  }, 1000);
  return true;
}

function addNewAlien() {
  alien.alive = false;
  // use setTimeout to create a new player after 1 second (1000 miliseconds)
  setTimeout(function () {
    alien = new Alien(alienImage);
  }, 1000);
  return true;
}

// ====================== WIN FUNCTION ======================= //

/* function winGame() {
  // Display the winning message
  gameStatus.textContent = "You won!";

  // Stop the game loop
  clearInterval(gameInterval);

  // Disable player movement
  document.removeEventListener('keydown', movePlayer);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Reset player, bullets, and aliens
  player = new Player();
  playerBullets = [];
  alienList = [];

  // Restart game
  restartGame();
} */

// ====================== GAME PROCESSES ======================= //
function gameLoop() {
  //clear canvas
  ctx.clearRect(0, 0, width, height);
  //check player alive 
  if (player.alive) {
    // draw player ship 
    player.update();
    player.draw();

    // Check if player has reached 1 thousand points
    /* if (player.score >= 1000) {
      winGame();
      return;
    } */

    // Update and draw the aliens
    for (let i = 0; i < alienList.length; i++) { // loops through each alien in the alienList array 
      let alien = alienList[i];
      alien.update(); // update its stat and draw to canvas
      alien.draw();
      let hit = detectHit(player, alien);
    } // also check if aliens collide with the 'player' object by calling the 'detectHit' function
  }
  // Update and draw the player bullets
  for (let i = 0; i < playerBullets.length; i++) { //loops through each bullet in playerBullets array
    let bullet = playerBullets[i];
    bullet.update2(); //update its state and draws it on the canvas
    bullet.draw();
    // Remove the bullet if it goes out of screen
    if (bullet.y < 0) {  // checks if bullet has gone off the top of the screen
      playerBullets.splice(i, 1); // if so removes it from the array
      i--;
    }
  }

  // Check for collisions between player bullets and aliens
  for (let i = 0; i < playerBullets.length; i++) { // loops through each bullet and alien in the game
    let bullet = playerBullets[i];
    for (let j = 0; j < alienList.length; j++) {
      let alien = alienList[j];
      if (alien.checkCollisionWithBullet(bullet)) { // check if any bullet collides with any alien 
        bullet.destroy(); // if collision is detected, both the bullet and the alien are removed from game
        alien.destroy();
        i--;
        break;
      }
    }
  }

  // Check for collisions between player and aliens
  for (let i = 0; i < alienList.length; i++) { // loops through each alienList array using a for loop 
    let alien = alienList[i]; // the loop creates a new variable alien and set to current element of array using index 1
    if (player.checkCollisionWithAlien(alien)) { // method is called and appased the alien object as an argument
      player.destroy(); // if method is true it means that player has collided with alien and player.destroy() is called to remove player from game
      //status.innerHTML = 'Game Over';
      return;
    }
    /* function winGame() {
      // Display the winning message
      gameStatus.textContent = "You won!";

      // Stop the game loop
      clearInterval(gameLoop);

      // Disable player movement
      document.removeEventListener('keydown', movePlayer);
    } */
  }
  canvas.focus(); // set focus back to canvas
}

// ====================== COLLISION DETECTION ======================= //
function detectHit(player, opponent) {
  //console.log('opponent y', opponent.y);
  //console.log('player y', player.y);
  let hitTest = ( // checks if player and opponent are colliding by creating a hitTest that is true  
    player.y + player.height > opponent.y && // if player and opponent have overlapping x and y positions on the canvas
    player.y < opponent.y + opponent.height &&
    player.x + player.width > opponent.x &&
    player.x < opponent.x + opponent.width
  );

  if (hitTest) { // check if hitTest is true. 
    /*if (opponent instanceof Alien) { // If opponent instance of alien clears the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add this code to check if score is greater than or equal to 1000 and end game if true
      let newScore = Number(score.textContent) + 100;
      score.textContent = newScore;
      if (newScore >= 1000) {
        gameStatus.innerHTML = 'Congratulations! You won!';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        endGame(); 
      }*/
    if (opponent instanceof Alien) { // If opponent instance of alien clears the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      endGame();  // end the game and retrue true
        return true;
    } else if (opponent instanceof Bullet) { // if opponent instance of bullet clears the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      endGame(); // end the game and retrue true

      //return;
    }
    return true;
  }

  // check if player bullet hit opponent
  if (player.bullets && player.bullets.length > 0) {
    for (let i = 0; i < player.bullets.length; i++) {
      let bullet = player.bullets[i];
      if (bullet.y < 0) {
        player.bullets.splice(i, 1);
        continue;
      }
      if (bullet.x + bullet.width > opponent.x && bullet.x < opponent.x + opponent.width && bullet.y < opponent.y + opponent.height && bullet.y + bullet.height > opponent.y) {
        // Remove bullet from player bullets array
        player.bullets.splice(i, 1);

        if (opponent instanceof Alien) {
          // Add 100 points to current score 
          let newScore = Number(score.textContent) + 100;
          score.textContent = newScore;
        }

        return true;
      }

    }
  }
}

// ====================== RESTART ======================= //
let restartButton = document.querySelector('#restartBtn');

function restartGame() {
  score.textContent = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  alienList = [];

  if (score.textContent === '0') {
    gameStatus.textContent = 'Play the Game';
  }
}

restartButton.addEventListener('click', restartGame);
console.log(restartButton);

function endGame() {
  if (Number(score.textContent) >= 1000) {
    gameStatus.innerHTML = 'Congratulations! You won!';
  } else {
    gameStatus.innerHTML = 'Game Over! Alien Won!';
  }

  // Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  setTimeout(() => {
    gameStatus.innerHTML = 'Play the Game';
  }, 1000);

  player.destroy();
  alienList = [];
  bulletList = [];
  clearInterval(gameInterval);
  score.textContent = 0;
}

let gameInterval;
