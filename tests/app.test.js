describe("Galaxy Shooter game", function() {
    let game;

    beforeEach(function() {
        game = new GalaxyShooterGame();
    });

    describe("Initialization", function() {
        it("should initialize with the correct settings", function() {
            expect(game.score).toEqual(0);
            expect(game.lives).toEqual(3);
            expect(game.gameOver).toBe(false);
            expect(game.paused).toBe(false);
        });
    });

    describe("Player movement", function() {
        it("should move the player to the left when the left arrow key is pressed", function() {
            const initialXPosition = game.player.x;
            expect(game.player.x).toBeLessThan(initialXPosition);
        });

        it("should move the player to the right when the right arrow key is pressed", function() {
            const initialXPosition = game.player.x;
            expect(game.player.x).toBeGreaterThan(initialXPosition);
        });
    });

    describe("Enemy movement", function() {
        it("should move the enemies to the right when the game is not paused", function() {
            const initialXPositions = game.enemies.map(enemy => enemy.x);
            game.update(); // simulate updating the game 
            const newPositions = game.enemies.map(enemy => enemy.x);
            expect(newPositions.every((pos, i) => pos > initialXPositions[i])).toBe(true);
        });

        it("should not move the enemies when the game is paused", function() {
            const initialXPositions = game.enemies.map(enemy => enemy.x);
            game.togglePause(); // simulate pausing the game 
            game.update(); // simulate updating the game while paused 
            const newPosition = game.enemies.map(enemy => enemy.x);
            expect(newPosition).toEqual(initialXPositions);
        });
    });

    describe("Collision detection", function() {
        it("should decrease the player's lives when an enemy collides with the player", function() {
            const initialLives = game.lives;
            game.enemies[0].x = game.player.x; // simulate an enemy colliding with the player 
            game.update();
            expect(game.lives).toEqual(initialLives - 1);
        });

        it("should increase the player's score when a bullet hits an enemy", function() {
            const initialScore = game.score;
            game.bullets.push(new Bullet(game.player.x, game.player.y)); // simulate the player firing a bullet 
            game.enemies[0].y = game.bullets[0].y; // simulate a bullet hitting the enemy
            game.update(); 
            expect(game.score).toEqual(initialScore + 10); // assuming each enemy is worth 10 points
        });
    });
});