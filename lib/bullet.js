var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

function Bullet(pos, vel, game) {
  MovingObject.call(this, {game: game, pos: pos, vel: vel, radius: Bullet.RADIUS, color: Bullet.COLOR});;
}

Bullet.RADIUS = 5;
Bullet.COLOR = "#CCCCCC";
Util.inherits(Bullet, MovingObject);
Bullet.prototype.isWrappable = false;
Bullet.prototype.collideWith = function(otherObject)
{
  if (otherObject instanceof Asterboid)
  {
    //this.game.updateScore(true);
    this.game.remove(this);
    this.game.remove(otherObject);
  }

};
module.exports = Bullet;
