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
