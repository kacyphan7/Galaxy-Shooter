class GalaxyShooterGame {
    constructor() {
      this.score = 0;
      this.lives = 3;
      this.gameOver = false;
      this.paused = false;
      this.player = new Player();
      this.enemies = [];
      this.bullets = [];
    }
  
    // other methods and game logic here
  }
  
  class Player {
    constructor() {
      this.x = 0;
      this.y = 0;
      // other properties and methods for the player here
    }
  }
  
  class Enemy {
    constructor() {
      this.x = 0;
      this.y = 0;
      // other properties and methods for the enemies here
    }
  }
  
  class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      // other properties and methods for the bullets here
    }
  }