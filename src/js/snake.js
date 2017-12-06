import Config from './config.js';

class Snake {
  constructor() {
    this._length = Config.snakeLength;
    this._cellSize = Config.cellSize;
    this._coordinates = [];
    this._dX = 0;
    this._dY = 0;
    this._currentDirection = '';
    this._isNeedToGrow = false;
    this._bodyColor = Config.snakeBodyColor;
    this._headColor = Config.snakeHeadColor;

    this._lastChangeCoordinates = {
      reduce: [],
      add: [],
      drop() {
        this.reduce = [];
        this.add = [];
      }
    };

    this._eventCrash = new Event('crash');
  }

  init() {
    const offsetX = 3,
          offsetY = 3;
    this._lastChangeCoordinates.drop();
    for (let i = 0, len = this._length; i < len; i++) {
      this._increaseLengthByCoordinates(offsetX + i, offsetY);
      this._lastChangeCoordinates.add.push({
        x: offsetX + i,
        y: offsetY
      });
    }

    this.toRight();
  }

  setContext(canvasContext) {
    this._ctx = canvasContext;
  }

  getLastChangeCoordinates() {
    return this._lastChangeCoordinates;
  }

  getNextHeadCoordinates() {
    const head = this._coordinates[this._coordinates.length - 1];
    return {x: head.x + this._dX, y: head.y + this._dY};
  }

  _increaseLengthByCoordinates(x, y) {
    this._coordinates.push({x, y});
    this._length = this._coordinates.length;
  }

  grow() {
    this._isNeedToGrow = true;
  }

  _moveOneStep() {
    const head = this.getNextHeadCoordinates();
    // if snake break into itself
    if (this._coordinates.findIndex(obj => obj.x === head.x && obj.y === head.y) !== -1) {
      this.crash();
      return;
    }

    this._lastChangeCoordinates.drop();
    if (!this._isNeedToGrow) {
      this._lastChangeCoordinates.reduce.push({
        x: this._coordinates[0].x,
        y: this._coordinates[0].y
      });
      this._coordinates.shift();
    }
    else {
      this._isNeedToGrow = false;
    }

    this._increaseLengthByCoordinates(head.x, head.y);
    this._lastChangeCoordinates.add.push({
      x: head.x,
      y: head.y
    });
  }

  _clear() {
    for (let i = 0, len = this._length, coords; i < len; i++) {
      coords = this._coordinates[i];
      this._ctx.clearRect(coords.x * this._cellSize, coords.y * this._cellSize, this._cellSize, this._cellSize);
    }
  }

  draw() {
    this._ctx.fillStyle = this._headColor;
    let coords = this._coordinates[this._length - 1];
    this._ctx.fillRect(coords.x * this._cellSize, coords.y * this._cellSize, this._cellSize, this._cellSize);
    
    this._ctx.fillStyle = this._bodyColor;
    for (let i = this._length - 2; i >= 0; i--) {
      coords = this._coordinates[i];
      this._ctx.fillRect(coords.x * this._cellSize, coords.y * this._cellSize, this._cellSize, this._cellSize);
    }
  }

  renderStep() {
    this._clear();
    this._moveOneStep();
    this.draw();
  }

  getCurrentDirection() {
    return this._currentDirection;
  }

  toRight() {
    this._currentDirection = 'horizontal';
    this._dX = 1;
    this._dY = 0;
  }

  toLeft() {
    this._currentDirection = 'horizontal';
    this._dX = -1;
    this._dY = 0;
  }

  toTop() {
    this._currentDirection = 'vertical';
    this._dX = 0;
    this._dY = -1;
  }

  toBottom() {
    this._currentDirection = 'vertical';
    this._dX = 0;
    this._dY = 1;
  }

  crash() {
    document.dispatchEvent(this._eventCrash);
  }
}

export default Snake;
