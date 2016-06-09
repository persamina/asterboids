var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

function Asterboid(pos, game, asterboidImg) {
  this.asterboidImg = asterboidImg;
  MovingObject.call(this, {game: game, pos: pos, vel: Util.randVec(), radius: Asterboid.RADIUS, color: Asterboid.COLOR});

};
Asterboid.RADIUS = 25;
Asterboid.COLOR = "#00C685";
Util.inherits(Asterboid, MovingObject);
Asterboid.prototype.collideWith = function(otherObject)
{
  if (otherObject instanceof Ship)
  {
    otherObject.relocate();
  }
  if (otherObject instanceof Bullet)
  {
    //this.game.updateScore(true);
    this.game.remove(this);
    this.game.remove(otherObject);
  //Game.NUM_AsterboidS -= 2;
  }
};
Asterboid.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.angle());
  ctx.drawImage(this.asterboidImg, -(Asterboid.RADIUS), -(Asterboid.RADIUS), Asterboid.RADIUS*2, Asterboid.RADIUS*2);
  ctx.restore();
  //ctx.beginPath();
  //ctx.drawImage(this.asterboidImg, this.pos[0], this.pos[1], this.radius, this.radius);
  //ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI, false);
  //ctx.fillStyle = this.color;
  //ctx.fill();
};
module.exports = Asterboid;
