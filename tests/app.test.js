// test for bullet class 

describe("Bullet", function() {
  let bullet;
console.log(restartButton);
  beforeEach(function() {
    bullet = new Bullet(10, 10);
  });

  describe("constructor", function() {
    it("should set the initial position and dimensions of the bullet", function() {
      expect(bullet.x).toEqual(10);
      expect(bullet.y).toEqual(10);
      expect(bullet.width).toEqual(5);
      expect(bullet.height).toEqual(5);
    });

    it("should set the color and vertical speed of the bullet", function() {
      expect(bullet.color).toEqual("yellow");
      expect(bullet.dy).toEqual(15);
    });
  });

  describe("update", function() {
    it("should update the position of the bullet", function() {
      bullet.update();

      expect(bullet.y).toEqual(25);
    });
  });

  describe("destroy", function() {
    it("should remove the bullet from the list of active bullets", function() {
      bulletList = [bullet];

      bullet.destroy();

      expect(bulletList.length).toEqual(0);
    });
  });
});

// test for player class
describe('Player', function() {
  let player;

  beforeEach(function() {
    player = new Player(playerImg, width / 2 - 25, height - 75);
  });

  describe('constructor', function() {
    it('should create a new player object with default properties', function() {
      expect(player.x).toBe(width / 2 - 25);
      expect(player.y).toBe(height - 75);
      expect(player.width).toBe(50);
      expect(player.height).toBe(50);
      expect(player.dx).toBe(0);
      expect(player.dy).toBe(0);
      expect(player.speed).toBe(20);
      expect(player.bulletList).toEqual([]);
      expect(player.alive).toBe(true);
      expect(player.score).toBe(0);
    });
  });

  describe('update', function() {
    it('should update the player position and bullet positions', function() {
      player.update();
      expect(player.x).toBe(width / 2 - 25);
      expect(player.y).toBe(height - 75);
    });
  });

  describe('reset', function() {
    it('should reset player position, speed, bullet list, and score', function() {
      player.x = 100;
      player.y = 200;
      player.dx = 2;
      player.dy = -3;
      player.bulletList = [{x: 50, y: 100}];
      player.score = 500;
      player.reset();
      expect(player.x).toBe(width / 2 - 25);
      expect(player.y).toBe(height - 75);
      expect(player.dx).toBe(0);
      expect(player.dy).toBe(0);
      expect(player.bulletList).toEqual([]);
      expect(player.score).toBe(0);
    });
  });
});

// test for class alien 
describe("Alien", () => {
  let alien;
  let alienImage = new Image();
  alienImage.src = "alien.png";
  let x = 50;
  let rowCount = 0;

  beforeEach(() => {
    alien = new Alien(alienImage, x, rowCount);
  });

  it("should have initial properties set correctly", () => {
    expect(alien.image).toEqual(alienImage);
    expect(alien.x).toEqual(x);
    expect(alien.y).toEqual(rowCount);
    expect(alien.width).toEqual(50);
    expect(alien.height).toEqual(50);
    expect(alien.dx).toEqual(5);
    expect(alien.dy).toEqual(50);
    expect(alien.lives).toEqual(1);
    expect(alien.bulletList).toEqual([]);
  });

  it("should fire a bullet when fireBullet() is called", () => {
    alien.fireBullet();
    expect(alien.bulletList.length).toEqual(1);
  });

  it("should detect collision with a bullet when checkCollisionWithBullet() is called", () => {
    let bullet = { x: 55, y: 20, width: 5, height: 10 };
    expect(alien.checkCollisionWithBullet(bullet)).toBe(true);
  });

  it("should update its position and bullets when update() is called", () => {
    alien.update();
    expect(alien.x).toEqual(x + alien.dx);
    expect(alien.bulletList.length).toBeLessThanOrEqual(1);
  });

  it("should be destroyed when destroy() is called", () => {
    let score = player.score;
    alien.destroy();
    expect(player.score).toEqual(score + 100);
    expect(alienList.length).toBeLessThanOrEqual(1);
  });
});
