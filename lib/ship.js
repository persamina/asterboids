var MovingObject = require('./movingObject.js');
var Util = require('./util.js');
var Bullet = require('./bullet.js');

function Ship(pos, game, shipImg) {
  this.shipImg = shipImg;
  this.shipImg.height = Ship.RADIUS;
  this.shipImg.width = Ship.RADIUS;
  MovingObject.call(this, {game: game, pos: pos, vel: [0,0], radius: Ship.RADIUS, color: Ship.COLOR});
};
Ship.RADIUS = 30;
Ship.COLOR = "#A17DAF";
Util.inherits(Ship, MovingObject);
Ship.prototype.fireBullet = function()
{

  var vel = new Array(2);
  if (this.vel[0] == 0 && this.vel[1] == 0) { vel = [0,-10];}
  else { vel = [this.vel[0]*10, this.vel[1]*10]}
  var bullet = new Bullet([this.pos[0], this.pos[1]], vel, this.game);
  this.game.add(bullet);
};
Ship.prototype.collideWith = function(otherObject)
{
  if (otherObject instanceof Asterboid)
  {
    this.relocate();
  }
};
Ship.prototype.relocate = function()
{
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};
Ship.prototype.power = function(impulse)
{
  console.log(impulse);
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};
Ship.prototype.draw = function(ctx)
{
  ctx.save();
  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.angle());
  ctx.drawImage(this.shipImg, -(Ship.RADIUS), -(Ship.RADIUS), Ship.RADIUS*2, Ship.RADIUS*2);
  ctx.restore();
};
/*
Ship.prototype.shipAngle = function()
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
*/
module.exports = Ship;
