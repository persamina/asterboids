var Node = require('./node.js');

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
