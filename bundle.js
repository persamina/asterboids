/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(1);
	var MovingObject = __webpack_require__(2);
	var Asterboid = __webpack_require__(3);
	var Ship  = __webpack_require__(4);
	var Bullet  = __webpack_require__(5);
	var Game = __webpack_require__(6);
	var GameView = __webpack_require__(7);
	var Node = __webpack_require__(8);
	var KDTree = __webpack_require__(9);

	//Set to global window
	window.MovingObject = MovingObject;
	window.Asterboid = Asterboid;
	window.Util = Util;
	window.Ship = Ship;
	window.Bullet = Bullet;
	window.Game = Game;
	window.GameView = GameView;
	window.Node = Node;
	window.KDTree = KDTree;


	//get a reference to the canvas
	var canvas = document.getElementById('canvas');

	//get a reference to the drawing context
	var ctx = canvas.getContext('2d');
	var backgroundImg = new Image();
	var asterboidImg = new Image();
	var shipImg = new Image();
	backgroundImg.onload = function () {
	  ctx.drawImage(backgroundImg, 0, 0);
	};
	//http://opengameart.org/content/map-tile
	//backgroundImg.src = './img/grass.jpg';
	backgroundImg.src = './img/grass.jpg';
	//https://www.iconfinder.com/icons/1105413/animal_bird_brand_figure_ios_swift_icon#size=128
	asterboidImg.src = './img/boid.png';
	//https://www.iconfinder.com/icons/23670/blaster_fighter_rocket_space_spaceship_icon#size=128
	shipImg.src = './img/plane.png'
	var game = new Game(backgroundImg, asterboidImg, shipImg);
	var gameView = new GameView(game, ctx);
	gameView.start();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var Util = {};

	Util.inherits = function(childClass, parentClass)
	{
	  function Surrogate() {};
	  Surrogate.prototype = parentClass.prototype;
	  childClass.prototype = new Surrogate();
	  childClass.prototype.constructor = childClass;
	};
	Util.randVec = function()
	{
	  var randVelocity = 0;
	  var vel = new Array(2);
	  vel[0] = Math.round(Math.random()*10)-5;
	  vel[1] = Math.round(Math.random()*10)-5;
	  return vel;
	    //return [1,1];
	};

	module.exports = Util;


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	MovingObject.prototype.distanceApart = function(otherObject) {
	  var xDist = this.pos[0] - otherObject.pos[0];
	  var yDist = this.pos[1] - otherObject.pos[1];
	  var CenterDistApart = Math.sqrt(Math.pow(xDist, 2)+Math.pow(yDist, 2));
	  return CenterDistApart - this.radius - otherObject.radius;
	};
	MovingObject.prototype.distanceSquareFromCenter = function(otherObject) {
	  var xDist = this.pos[0] - otherObject.pos[0];
	  var yDist = this.pos[1] - otherObject.pos[1];
	  var CenterDistSquareApart = Math.pow(xDist, 2)+Math.pow(yDist, 2);
	  return CenterDistSquareApart;
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
	  if (this.vel[0] == 0 && this.vel[1] == 0) {return 0;}
	  if (this.vel[0] == 0 && this.vel[1] < 0) {return 0;}
	  if (this.vel[0] == 0 && this.vel[1] > 0) {return Math.PI;}
	  if (this.vel[0] > 0 && this.vel[1] == 0) {return Math.PI/2;}
	  if (this.vel[0] < 0 && this.vel[1] == 0) {return -Math.PI/2;}
	  if(this.vel[0] < 0 && this.vel[1] < 0)
	  {
	    return -Math.PI/2 + Math.atan(this.vel[1]/this.vel[0]);
	  }
	  if(this.vel[0] <0 && this.vel[1] > 0)
	  {
	    return -Math.PI/2+(Math.atan(this.vel[1]/this.vel[0]));
	  }
	  if(this.vel[0] > 0 && this.vel[1] < 0)
	  {
	    return Math.PI/2+Math.atan(this.vel[1]/this.vel[0]);
	  }
	  if(this.vel[0] > 0 && this.vel[1] > 0)
	  {
	    return (Math.PI/2)+Math.atan(this.vel[1]/this.vel[0]);
	  }
	};
	/*
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
	*/
	MovingObject.prototype.collideWith = function(otherObject)
	{
	  //this.game.remove(this);
	  //this.game.remove(otherObject);
	  //Game.NUM_ASTEROIDS -= 2;
	};

	module.exports = MovingObject;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2);
	var Util = __webpack_require__(1);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2);
	var Util = __webpack_require__(1);
	var Bullet = __webpack_require__(5);

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2);
	var Util = __webpack_require__(1);

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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
	Game.DIM_X = 900;
	Game.DIM_Y = 600;
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
	  ctx.fillRect(0,0,Game.DIM_X, Game.DIM_Y);
	  ctx.drawImage(this.backgroundImg, 0, 0);
	  this.updateScores(ctx);
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
	Game.prototype.updateScores = function(ctx)
	{
	  ctx.font = "16px PT Sans";
	  ctx.fillStyle = "white";
	  ctx.textAlign = "right";
	  var scoreText = "S: " + this.score + " HS: " + this.highScore;
	  var textHeight = ctx.measureText(scoreText).height;
	  ctx.fillText(scoreText, Game.DIM_X-15, Game.DIM_Y-15);
	}
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	function GameView(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	};
	GameView.prototype.bindKeyHandlers = function()
	{
	  key('up', function() {this.game.ship.power([0,-1])}.bind(this));
	  key('down', function() {this.game.ship.power([0,1])}.bind(this));
	  key('left', function() {this.game.ship.power([-1,0])}.bind(this));
	  key('right', function() {this.game.ship.power([1,0])}.bind(this));
	  key('space', function() {this.game.ship.fireBullet()}.bind(this));
	  /*
	  key('up', function() { this.game.ship.power([0,-1]); });
	  key('down', function() { this.game.ship.power([0,1]); });
	  key('left', function() { this.game.ship.power([-1, 0]); });
	  key('right', function() { this.game.ship.power([1,0]); });
	  */
	};
	GameView.prototype.start = function() {
	  this.game.updateScore(false);
	  this.bindKeyHandlers();
	  setInterval(function() {
	    arguments[0].game.step();
	    arguments[0].game.draw(arguments[0].ctx);
	  }, 20, this);
	};

	module.exports = GameView;


/***/ },
/* 8 */
/***/ function(module, exports) {

	function Node()
	{
	  this.asterboid;
	  this.lb;
	  this.rt;
	  this.rect;
	}

	module.exports = Node;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(8);

	function KDTree(xDim, yDim)
	{
	  this.xDim = xDim;
	  this.yDim = yDim;
	  this.initial;
	  this.size = 0;
	}


	KDTree.prototype.isEmpty = function()
	{
	  return (this.size == 0 && this.initial == undefined)
	}
	KDTree.prototype.size = function()
	{
	  return this.size;
	}
	KDTree.prototype.insert = function(asterboid)
	{
	  var level = 0;
	  var inserted = false;
	  var cmpXCoor = false;
	  var currentNodeCV;
	  var insertNodeCV;
	  var rectCoor = [0.0, 0.0, this.xDim, this.yDim];
	  var currentNode = this.initial;
	  var newNode = new Node();

	  while(!inserted)
	  {
	    if (currentNode == undefined)
	    {
	      currentNode = new Node();
	      currentNode.asterboid = asterboid;
	      currentNode.rect = rectCoor;
	      inserted = true;
	      if (this.size == 0) { this.initial = currentNode; }
	      continue;
	    }
	    if (level % 2 == 0)
	    {
	      currentNodeCV = currentNode.asterboid.pos[0];
	      insertNodeCV = asterboid.pos[0];
	      cmpXCoor = true;
	    }
	    else
	    {
	      currentNodeCV = currentNode.asterboid.pos[1];
	      insertNodeCV = asterboid.pos[1];
	      cmpXCoor = false;
	    }

	    if (insertNodeCV < currentNodeCV)
	    {
	      if (cmpXCoor)
	        rectCoor[2] = currentNode.asterboid.pos[0];
	      else
	        rectCoor[3] = currentNode.asterboid.pos[1];
	      if (currentNode.lb != undefined)
	      {
	        currentNode = currentNode.lb;
	        level++;
	        continue;
	      }
	      newNode = new Node();
	      newNode.asterboid = asterboid;
	      newNode.rect = rectCoor;
	      currentNode.lb = newNode;
	      inserted = true;
	    }
	    else
	    {
	      if (cmpXCoor)
	        rectCoor[0] = currentNode.asterboid.pos[0];
	      else
	        rectCoor[1] = currentNode.asterboid.pos[1];
	      if(currentNode.asterboid.pos[0] == asterboid.pos[0] && currentNode.asterboid.pos[1] == asterboid.pos[1])
	        break;
	      if (currentNode.rt != undefined)
	      {
	        currentNode = currentNode.rt;
	        level++;
	        continue;
	      }

	      newNode = new Node();
	      newNode.asterboid = asterboid;
	      newNode.rect = rectCoor;
	      currentNode.rt = newNode;
	      inserted = true;
	    }
	    level++;

	  }
	  if (inserted) { this.size++ };
	}

	KDTree.prototype.range = function(asterboid)
	{
	  var currentNode = new Node();;
	  var firstSearch = new buckets.Queue();
	  var closestNeighbors = [];
	  firstSearch.enqueue(this.initial);
	  while (!firstSearch.isEmpty())
	  {
	    currentNode = firstSearch.dequeue();
	    if (asterboid.inNeighborhood(currentNode.asterboid))
	    {
	      closestNeighbors.push(currentNode.asterboid);
	    }

	    if (currentNode.lb != undefined && asterboid.intersects(currentNode.lb.rect))
	    {
	      firstSearch.enqueue(currentNode.lb);
	    }
	    if (currentNode.rt != undefined && asterboid.intersects(currentNode.rt.rect))
	    {
	      firstSearch.enqueue(currentNode.rt);
	    }
	  }
	  return closestNeighbors;
	}
	module.exports = KDTree;


/***/ }
/******/ ]);