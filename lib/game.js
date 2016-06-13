function Game(backgroundImg, asterboidImg, shipImg) {
  this.asterboids = new Array(Game.NUM_Asterboids);

  this.bullets = [];
  this.backgroundImg = backgroundImg;
  this.asterboidImg = asterboidImg;
  this.shipImg = shipImg;
  this.ship = new Ship(this.randomPosition(), this, this.shipImg);
  this.addAsterboids();
  this.score = 0;
  this.highScore = 0;
  this.kdTree;
};
Game.DIM_X = 800;
Game.DIM_Y = 550;
Game.NUM_Asterboids = 25;
Game.prototype.add = function(obj)
{
  if (obj instanceof Bullet)
  {
    this.bullets.push(obj);
  }
  if (obj instanceof Asterboid)
  {
    this.asterboids.push(obj);
  }
};
Game.prototype.allObjects = function()
{
  var allObj = [this.ship].concat(this.asterboids).concat(this.bullets);
  //allObj.push(this.ship);
  return allObj;
};

Game.prototype.addAsterboids = function()
{
  for (var i = 0; i < Game.NUM_Asterboids; i++)
  {
    this.asterboids[i] = new Asterboid(this.randomPosition(), this, this.asterboidImg);
  }
};
Game.prototype.draw = function(ctx)
{
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  var pat1 = ctx.createPattern(this.backgroundImg,'repeat');
  ctx.fillStyle = pat1;
  ctx.fillRect(0,0,800,600);
  ctx.drawImage(this.backgroundImg, 0, 0);
  var allObj = this.allObjects();
  for (var i = 0; i < allObj.length; i++)
  {
    if(!allObj[i].isWrappable && this.isOutOfBounds(allObj[i].pos))
    {
      this.remove(allObj[i]);
    }
    else
    {
      allObj[i].draw(ctx);
    }

  }
};
Game.prototype.randomPosition = function()
{
  var pos = new Array(2);
  pos[0] = Math.round(Math.random() * Game.DIM_X);
  pos[1] = Math.round(Math.random() * Game.DIM_Y);
  return pos;
};
Game.prototype.step = function()
{

  if(this.asterboids.length < 5)
  {
    for (var i = 0; i < 10; i++)
    {
      this.add(new Asterboid(this.randomPosition(), this, this.asterboidImg));
    }
  }

  this.moveObjects();
  this.checkCollisions();
}
Game.prototype.moveObjects = function()
{
  var allObj = this.allObjects();
  this.kdTree = this.createKDTree();
  for (var i = 0; i < allObj.length; i++)
  {
    if (allObj[i] instanceof Asterboid)
    {
      allObj[i].calcVel();
    }
    allObj[i].move();
  }
};
Game.prototype.createKDTree = function()
{
  this.kdTree = new KDTree(Game.DIM_X, Game.DIM_Y);
  for(var i = 0; i < this.asterboids.length; i++)
  {
    this.kdTree.insert(this.asterboids[i]);
  }
  return this.kdTree;
};
Game.prototype.wrap = function(pos)
{
  if (pos[0] > Game.DIM_X)
  {
    pos[0] = 0;
  }
  if (pos[1] > Game.DIM_Y)
  {
    pos[1] = 0;
  }
  if (pos[0] < 0)
  {
    pos[0] = Game.DIM_X;
  }
  if (pos[1] < 0)
  {
    pos[1] = Game.DIM_Y;
  }
};
Game.prototype.checkCollisions = function() {
  var allObj = this.allObjects();
  for (var i = 0; i < allObj.length; i++)
  {
    for (var j=i+1; j<allObj.length; j++)
    {
      if (allObj[i].isCollidedWith(allObj[j]))
      {
        if (allObj[i] instanceof Ship && allObj[j] instanceof Asterboid)
        {
          this.score = 0;
          this.updateScore(false);
        }
        allObj[i].collideWith(allObj[j]);
      }
    }
  }
};
Game.prototype.remove = function(obj)
{
  var arrToSearch;
  if (obj instanceof Bullet)
  {
    arrToSearch = this.bullets;
  }
  if (obj instanceof Asterboid)
  {
    this.updateScore(true);
    arrToSearch = this.asterboids;
  }
  var index = arrToSearch.indexOf(obj)
  arrToSearch.splice(index, 1);
};
Game.prototype.updateScore = function(increaseScore)
{
  if (increaseScore) { this.score += 10;}
  if (this.highScore < this.score) {this.highScore = this.score;}
  $(".score").text("Score: " + this.score);
  $(".highScore").text("High Score: " + this.highScore);
};
Game.prototype.isOutOfBounds = function(pos)
{
  if (pos[0] >= Game.DIM_X || pos[1] >= Game.DIM_Y)
  {
    return true;
  }
  return false;
}
module.exports = Game;
