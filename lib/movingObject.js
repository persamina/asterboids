function MovingObject(params)
{
  this.game = params.game;
  this.pos = params.pos;
  this.vel = params.vel;
  this.radius = params.radius;
  this.color = params.color;

}
MovingObject.prototype.isWrappable = true;
MovingObject.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI, false);
  ctx.fillStyle = this.color;
  ctx.fill();
};
MovingObject.prototype.move = function() {
  if(this.isWrappable) { this.game.wrap(this.pos); }
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};
MovingObject.prototype.isCollidedWith = function(otherObject) {
  var xDist = this.pos[0] - otherObject.pos[0];
  var yDist = this.pos[1] - otherObject.pos[1];
  //keep as distance squared as sqrt is costly
  var distSquaredApart = Math.pow(xDist, 2)+Math.pow(yDist, 2);
  if (distSquaredApart < Math.pow(this.radius+otherObject.radius, 2))
  {
    return true;
  }
  return false;
};
MovingObject.prototype.angle = function()
{
  if (this.vel[0] == 0 && this.vel[1] == 0) {return Math.PI;}
  if (this.vel[0] == 0 && this.vel[1] < 0) {return Math.PI;}
  if (this.vel[0] == 0 && this.vel[1] > 0) {return 0;}
  if (this.vel[0] > 0 && this.vel[1] == 0) {return -Math.PI/2;}
  if (this.vel[0] < 0 && this.vel[1] == 0) {return Math.PI/2;}
  if(this.vel[0] < 0 && this.vel[1] < 0)
  {
    return Math.PI/2 + Math.atan(this.vel[1]/this.vel[0]);
  }
  if(this.vel[0] <0 && this.vel[1] > 0)
  {
    return Math.PI/2+(Math.atan(this.vel[1]/this.vel[0]));
  }
  if(this.vel[0] > 0 && this.vel[1] < 0)
  {
    return -(Math.PI/2)+Math.atan(this.vel[1]/this.vel[0]);
  }
  if(this.vel[0] > 0 && this.vel[1] > 0)
  {
    return -(Math.PI/2)+Math.atan(this.vel[1]/this.vel[0]);
  }
};
MovingObject.prototype.collideWith = function(otherObject)
{
  //this.game.remove(this);
  //this.game.remove(otherObject);
  //Game.NUM_ASTEROIDS -= 2;
};
module.exports = MovingObject;
