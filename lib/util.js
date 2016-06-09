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
