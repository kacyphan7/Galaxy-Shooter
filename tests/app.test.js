describe("Alien class", function() {

    it("should fire a bullet", function() {
      expect(alien.fireBullet).toHaveBeenCalled();
    });
  
    it("should detect collision with bullet", function() {
      expect(collision).toBe(true);
    });
  
    it("should destroy the alien", function() {
      expect(alienList).not.toContain(alien);
      expect(player.destroyAlien).toHaveBeenCalled();
    });
  });

describe('Player', () => {
  
    it('should move the player horizontally', () => {
      expect(player.x).toEqual(originalX + 5);
    });
  
    it('should move the player vertically', () => {
      expect(player.y).toEqual(originalY - 5);
    });
  
    it('should fire a bullet when fireBullet is called', () => {
      expect(player.fireBullet).toHaveBeenCalled();
      expect(player.bulletList.length).toEqual(1);
    });
  
    it('should check collision with an alien', () => {
      expect(player.checkCollisionWithAlien(alien, bullet)).toBe(true);
    });
});