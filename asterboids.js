var Util = require('./lib/util.js');
var MovingObject = require('./lib/movingObject.js');
var Asterboid = require('./lib/asterboid.js');
var Ship  = require('./lib/ship.js');
var Bullet  = require('./lib/bullet.js');
var Game = require('./lib/game.js');
var GameView  = require('./lib/gameView.js');

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
