describe("Bullet", function() {
  let bullet;

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
