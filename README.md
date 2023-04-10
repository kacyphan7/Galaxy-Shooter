# GALAXY SHOOTER
A space invader game inspired by Galaga. 

 ![My Remote Image](https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.0/c_scale,w_1000/ncom/en_US/games/switch/g/galaxy-shooter-switch/hero)

### Get ready to embark on a space combat mission with your starship! Travel through the galaxy and take down waves of alien formations. Navigate through a barrage of enemy fire and engage in an epic shoot-out!

Prepare to lead your sky force into a fierce space battle and maneuver through a chaotic assault in our alien shooter game! With only you and your space team as the galaxy's last hope, it's up to you to restore peace and fend off the alien invaders! Fire away and repel their attacks on the galaxy!

To play Galaxy Shooter online visit kacyphan7.github.io 

# HOW TO PLAY
1. Use the `arrow keys` or `wasd` to move your starship around the screen.
2. Press the `space bar` to fire your ship's weapon and destroy enemy formations.
3. Dodge enemy fire to avoid game over.
4. Defeat all enemies to gain points.
5. The game ends when alien reached the bottom of the screen, when player is hit by alien bullet, or player collided with alien.
6. Press `restart button` to restart game including new score and clear aliens off the screen.

# HOW TO INSTALL 
1. `Fork` and `Clone` this respository to your local machine
2. Open `index.html` in your browser to play or
3. Open the directory in your text editor of choice to view or edit the code

### Disclaimer

This project was modeled off of Galaga for nostalgic purposes. It was my favorite game to play on the BlackBerry SideKick when I first came to America. 

# HOW IT WORKS

This code is an implementation of a simple 2D shooting game. Galaxy Shooter is built using HTML, CSS, and JavaScript. The game uses the HTML5 Canvas API to update the game graphics and handle player input. JavaScript is used to manage the game state, including tracking the player's score, lives, and level. The game is played by controlling a spaceship to shoot down aliens while dodging their bullets. The main logic of the game is handled in a function called `gameLoop`, which is called every 60 milliseconds using the `setInterval` me

The code creates three classes to handle the entities: `Player`, `Alien`, and `Bullet`. `Player` handles the player spaceship, `Alien` handles the alien spaceships, and `Bullet` handles the bullets fired by both the player and the aliens.

The player spaceship is controlled using the `arrow keys or wasd` and fires bullets `vertically` upward by pressing the `space bar`. The alien spaceships are automatically generated at the top of the screen and move `horizontally` across the screen, firing bullets downwards randomly. The game ends if the player's spaceship is hit by an alien bullet or if an alien spaceship reaches the bottom of the screen.

Draw bullet 
``` javascript
draw() {
    ctx.beginPath();
    ctx.fillStyle = "#DEFA69";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();
  }
```
Update bullet 
``` javascript
update() {
    this.y += this.dy;
  }
```
Destroy bullet 
``` javascript
destroy() {
    // Remove bullet from list of active bullets
    let index = bulletList.indexOf(this);
    if (index !== -1) {
      bulletList.splice(index, 1);
    }
  }
```

The `Player` class handles the player's spaceship. The `Alien` class handles the alien spaceships, including generating them and moving them across the screen. The `Bullet` class handles the bullets fired by both the player and the aliens.

In the game, players must defend against a row of alien enemies that will descend towards the screen every 5 seconds. Additionally, a new row of aliens will appear every 10 seconds, creating a continuous loop until the game is over using the `setInterval` method.

Create array of aliens to add a row of aliens 
``` javascript
let alienList = [];
```

Add new row of alien in loop 
``` javascript
function createAlienRow(startX, startY) {
  let aliens = [];

  for (let i = 0; i < 6; i++) {
    let alien = new Alien(alienImage, startX + i * 60, startY);
    aliens.push(alien);
  }

  return aliens;
}
```

setInterval method for Alien rows
``` javascript
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
```

The game detects collisions between entities using the `detectHit` function. The game also displays the player's score and updates it as they shoot down aliens.

In summary, this code creates a simple 2D shooting game where the player controls a spaceship to shoot down aliens while dodging their bullets. The game is played on an HTML canvas and the `getContext` method to create a game board. using the `draw` and `update` methods to create and move the entities.

# FUTURE ENHANCEMENT
- Dynamic score labels for level and waves
- Bombs
- Machine gun power up 
- Spaceship sprite animation 
- Start and game over UI 
- Sound effects and music 

# PROCESS WORK

### Initial Wireframes:
 ![My Image](./screenshots/escalidraw-wireframe.png?raw=true)

