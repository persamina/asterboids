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
	var GameView  = __webpack_require__(7);

	//Set to global window
	window.MovingObject = MovingObject;
	window.Asterboid = Asterboid;
	window.Util = Util;
	window.Ship = Ship;
	window.Bullet = Bullet;
	window.Game = Game;
	window.GameView = GameView;


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
	//http://www.jpl.nasa.gov/assets/images/content/tmp/home/missions_bg_image.jpg
	backgroundImg.src = './img/background.jpg';
	//https://www.iconfinder.com/icons/1105413/animal_bird_brand_figure_ios_swift_icon#size=128
	asterboidImg.src = './img/boid.png';
	//https://www.iconfinder.com/icons/23670/blaster_fighter_rocket_space_spaceship_icon#size=128
	shipImg.src = './img/ship.png'
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2);
	var Util = __webpack_require__(1);

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
	  this.asterboids = new Array(Game.NUM_AsterboidS);

	  this.bullets = [];
	  this.backgroundImg = backgroundImg;
	  this.asterboidImg = asterboidImg;
	  this.shipImg = shipImg;
	  this.ship = new Ship(this.randomPosition(), this, this.shipImg);
	  this.addAsterboids();
	  this.score = 0;
	  this.highScore = 0;
	};
	Game.DIM_X = 800;
	Game.DIM_Y = 550;
	Game.NUM_AsterboidS = 10;
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
	  for (var i = 0; i < Game.NUM_AsterboidS; i++)
	  {
	    this.asterboids[i] = new Asterboid(this.randomPosition(), this, this.asterboidImg);
	  }
	};
	Game.prototype.draw = function(ctx)
	{
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
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
	  if(this.asterboids.length < 3)
	  {
	    for (var i = 0; i < 4; i++)
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
	  for (var i = 0; i < allObj.length; i++)
	  {
	    allObj[i].move();
	  }
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


/***/ }
/******/ ]);