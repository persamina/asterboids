var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

function Asterboid(pos, game, asterboidImg) {
  this.asterboidImg = asterboidImg;
  this.neighborBoids = [];
  MovingObject.call(this, {game: game, pos: pos, vel: Util.randVec(), radius: Asterboid.RADIUS, color: Asterboid.COLOR});
  this.viewRadius = Asterboid.RADIUS*10;
  //in radians 2PI radians in 360 degrees
  this.sideViewAngle = 135 * 2*Math.PI/360;
};
Asterboid.RADIUS = 15;
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
    this.game.remove(this);
    this.game.remove(otherObject);
  }
};
Asterboid.prototype.calcVel = function ()
{
  this.neighborBoids = this.findNeighbors();
  var Vel1 = this.flyToCenterV();
  var Vel2 = this.flyToKeepDist();
  var Vel3 = this.flyToMatchVel();

  this.vel[0] += Vel1[0] + Vel2[0] + Vel3[0];
  this.vel[1] += Vel1[1] + Vel2[1] + Vel3[1];
  this.limitVelocity();

  if (this.vel[0] == 0 && this.vel[1] == 0) { this.vel = Util.randVec(); }
};
Asterboid.prototype.limitVelocity = function()
{
  var velLimit = 4;
  var velMag = this.velMag();
  if (velMag > velLimit)
  {
    this.vel[0] = this.vel[0] / velMag * velLimit;
    this.vel[1] = this.vel[1] / velMag * velLimit;
  }
};
Asterboid.prototype.velMag = function()
{
  return Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
}
Asterboid.prototype.flyToCenterV = function()
{
  if (this.neighborBoids.length < 1) { return [0,0]; }
  var centerPos = this.boidsCenter(this.neighborBoids);
  return [(centerPos[0]-this.pos[0])/100, (centerPos[1]-this.pos[1])/100]
};
Asterboid.prototype.boidsCenter = function(boids)
{
  if (boids.length < 1) {return [0,0];}
  var xSum = 0;
  var ySum = 0;
  for (var i = 0; i < boids.length; i++)
  {
    if(boids[i] == this) { continue; }
    xSum += boids[i].pos[0];
    ySum += boids[i].pos[1];
  }
  return [xSum / boids.length, ySum / boids.length];
};
Asterboid.prototype.flyToKeepDist = function()
{
  if (this.neighborBoids.length < 1) { return [0,0]; }
  var vel = [0, 0];
  for (var i = 0; i < this.neighborBoids.length; i++)
  {
    if (this.neighborBoids[i] == this) { continue; }
    if (this.neighborBoids[i].distanceApart(this) < 20)
    {
      vel[0] -= (this.neighborBoids[i].pos[0] - this.pos[0])/30;
      vel[1] -= (this.neighborBoids[i].pos[1] - this.pos[1])/30;
    }
  }
  return vel;
};
Asterboid.prototype.flyToMatchVel = function()
{
  if (this.neighborBoids.length < 1) { return [0,0]; }
  var avgVel = this.boidsAvgVel(this.neighborBoids);
  return [(avgVel[0]-this.vel[0])/20, (avgVel[1]-this.vel[1])/20];
};
Asterboid.prototype.boidsAvgVel = function(boids)
{
  if (boids.length < 1) {return [0,0];}
  var xSum = 0;
  var ySum = 0;
  for (var i = 0; i < boids.length; i++)
  {
    if(boids[i] == this) { continue; }
    xSum += boids[i].vel[0];
    ySum += boids[i].vel[1];
  }
  return [xSum / boids.length, ySum / boids.length];
};
Asterboid.prototype.findNeighbors = function()
{
  return this.game.kdTree.range(this);
};
Asterboid.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.angle());
  ctx.drawImage(this.asterboidImg, -(Asterboid.RADIUS), -(Asterboid.RADIUS), Asterboid.RADIUS*2, Asterboid.RADIUS*2);
  ctx.restore();
};
Asterboid.prototype.inNeighborhood = function(otherAsterboid)
{
  if (this.pos[0] == otherAsterboid.pos[0] && this.pos[1] == otherAsterboid.pos[1])
  {
    return false;
  }
  var centerDistSquared = this.distanceSquareFromCenter(otherAsterboid);
  if (centerDistSquared < Math.pow(this.viewRadius, 2) )
  {
    var deltaY = this.pos[1]-otherAsterboid.pos[1];
    var deltaX = this.pos[0]-otherAsterboid.pos[0];
    var curTravelAngle = this.angle();
    var pointAngleBetween = Math.atan(deltaY/deltaX );
    if (deltaX == 0 && deltaY < 0) {return curTravelAngle < this.sideViewAngle;}
    if (deltaX == 0 && deltaY > 0) {return Math.PI - curTravelAngle < this.sideViewAngle;}
    if (deltaX < 0 && deltaY == 0) {return Math.PI/2 - curTravelAngle < this.sideViewAngle;}
    if (deltaX > 0 && deltaY == 0) {return -Math.PI/2 - curTravelAngle < this.sideViewAngle;}
    if (deltaX < 0 && deltaY < 0)
    {
      return Math.abs(curTravelAngle + pointAngleBetween) < this.sideViewAngle;
    }
    if (deltaX < 0 && deltaY > 0)
    {
      return Math.abs(curTravelAngle+Math.PI/2+pointAngleBetween) < this.sideViewAngle;
    }
    if (deltaX > 0 && deltaY < 0)
    {
      return Math.abs(curTravelAngle - pointAngleBetween) < this.sideViewAngle;
    }
    if (deltaX > 0 && deltaY > 0)
    {
      return Math.abs(curTravelAngle-Math.PI/2-pointAngleBetween) < this.sideViewAngle;
    }
  }
  return false;
};
Asterboid.prototype.intersects = function(searchRect)
{
  //approximate neighborhood circle (this.viewRadius) to square.
  var boidRect = [this.pos[0] - this.viewRadius,
              this.pos[1] - this.viewRadius,
              this.pos[0] + this.viewRadius,
              this.pos[1] + this.viewRadius];
  if (boidRect[0] > searchRect[2] || boidRect[2] < searchRect[0] ||
      boidRect[1] > searchRect[3] || boidRect[3] < searchRect[1] )
    {
      return false;
    }
  return true;
};

module.exports = Asterboid;
