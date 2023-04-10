describe("Player movement and shooting", function () {
  it("should move the player up when the up arrow key or 'w' is pressed", function () {
    const initialYPosition = canvas.player.y;
    triggerKeyDownEvent(canvas, "w");
    expect(canvas.player.y).toBeLessThan(initialYPosition);
  });

  it("should move the player down when the down arrow key or 's' is pressed", function () {
    const initialYPosition = canvas.player.y;
    triggerKeyDownEvent(canvas, "s");
    expect(canvas.player.y).toBeGreaterThan(initialYPosition);
  });

  it("should move the player to the left when the left arrow key or 'a' is pressed", function () {
    const initialXPosition = canvas.player.x;
    expect(canvas.player.x).toBeLessThan(initialXPosition);
  });

  it("should move the player to the right when the right arrow key or 'd' is pressed", function () {
    const initialXPosition = canvas.player.x;
    expect(canvas.player.x).toBeGreaterThan(initialXPosition);
  });

  it("should create a new bullet when the space bar is pressed", function () {
    const initialBulletCount = canvas.player.bulletList.length;
    triggerKeyDownEvent(canvas, " ");
    expect(canvas.player.bulletList.length).toBeGreaterThan(initialBulletCount);
  });
});

describe("Collision detection", function () {
  it("should decrease the player's lives when an enemy collides with the player", function () {
    const initialLives = canvas.lives;
    canvas.enemies[0].x = canvas.player.x; // simulate an enemy colliding with the player 
    canvas.update();
    expect(canvas.lives).toEqual(initialLives - 1);
  });

  it("should increase the player's score when a bullet hits an enemy", function () {
    const initialScore = canvas.score;
    canvas.bullets.push(new Bullet(canvas.player.x, canvas.player.y)); // simulate the player firing a bullet 
    canvas.enemies[0].y = canvas.bullets[0].y; // simulate a bullet hitting the enemy
    canvas.update();
    expect(canvas.score).toEqual(initialScore + 10); // assuming each enemy is worth 10 points
  });
});