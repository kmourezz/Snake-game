import Config from './config.js';
import Snake from './snake.js';

class GameField {
  constructor(dimension = {horizontal: Config.defaultFieldHorizontalSize, vertical: Config.defaultFieldVerticalSize}) {
    this._horizontal = dimension.horizontal;
    this._vertical = dimension.vertical;
    this._freeCellSize = Config.cellSize;
    this._cellBorderColor = Config.gridColor;
    this._appleColor = Config.appleColor;
    this._freeCells = []; //all cells except the snake
    this._apple = {x: 0, y: 0};
    this.score = 0;
    this._scoreUpdateEvent = new Event('score');
    this._snake = new Snake();
  }

  init() {
    this._initFreeCells();
    this._snake.init();
    this._updateFreeCells(this._snake.getLastChangeCoordinates());
    this._snake.draw(this._ctx);
    this._generateApple();
  }

  _initFreeCells() {
    for (let i = 0; i < this._vertical; i++) {
      for (let j = 0; j < this._horizontal; j++) {
        this._freeCells.push({x: j, y: i});
      }
    }
  }

  setContext(canvasContext) {
    this._ctx = canvasContext;
    this._snake.setContext(canvasContext);
  }

  update() {
    if (this._checkSnakeOutsideField()) {
      return;
    }
    this._snake.renderStep();
    this._updateFreeCells(this._snake.getLastChangeCoordinates());
    if (!this._checkAppleExist()) {
      this.score++;
      document.dispatchEvent(this._scoreUpdateEvent);
      this._generateApple();
      this._snake.grow();
    }
  }

  _updateFreeCells(changeCoordinates) {
    // each reducing cell from snake should be added to free cells, otherwise with additional cells
    let i, item, index;
    for (i = changeCoordinates.reduce.length - 1; i >= 0; i--) {
      item = changeCoordinates.reduce[i];
      if (!this._freeCells.includes(item)) {
        this._freeCells.push(item);
      }
    }
    for (i = changeCoordinates.add.length - 1; i >= 0; i--) {
      item = changeCoordinates.add[i];
      index = this._freeCells.findIndex(obj => obj.x === item.x && obj.y === item.y);
      if (index >= 0) {
        this._freeCells.splice(index, 1);
      }
    }
  }

  getHorizontalSize() {
    return this._horizontal * this._freeCellSize;
  }

  getVerticalSize() {
    return this._vertical * this._freeCellSize;
  }

  createBackground() {
    this._ctx.lineWidth = 1;
    for (let i = 1, x = this._horizontal; i < x; i++) {
      this._ctx.moveTo(i * this._freeCellSize - 0.5, 0);
      this._ctx.lineTo(i * this._freeCellSize - 0.5, this.getVerticalSize());
    }
    for (let i = 1, y = this._vertical; i < y; i++) {
      this._ctx.moveTo(0, i * this._freeCellSize - 0.5);
      this._ctx.lineTo(this.getHorizontalSize(), i * this._freeCellSize - 0.5);
    }
    this._ctx.strokeStyle = this._cellBorderColor;
    this._ctx.stroke();
  }

  _checkSnakeOutsideField() {
    const head = this._snake.getNextHeadCoordinates();
    if (head.x >= this._horizontal || head.x < 0 || head.y >= this._vertical || head.y < 0) {
      this._snake.crash();
      return true;
    }
    return false;
  }

  turnLeft() {
    if (this._snake.getCurrentDirection() === 'horizontal') {
      return false;
    }
    this._snake.toLeft();
    this.update();
    return true;
  }

  turnRight() {
    if (this._snake.getCurrentDirection() === 'horizontal') {
      return false;
    }
    this._snake.toRight();
    this.update();
    return true;
  }

  turnTop() {
    if (this._snake.getCurrentDirection() === 'vertical') {
      return false;
    }
    this._snake.toTop();
    this.update();
    return true;
  }

  turnBottom() {
    if (this._snake.getCurrentDirection() === 'vertical') {
      return false;
    }
    this._snake.toBottom();
    this.update();
    return true;
  }

  _checkAppleExist() {
    return this._freeCells.findIndex(obj => obj.x === this._apple.x && obj.y === this._apple.y) !== -1;
  }

  _generateApple() {
    const index = Math.floor(Math.random() * this._freeCells.length);
    this._apple = this._freeCells[index];
    this._ctx.fillStyle = this._appleColor;
    this._ctx.fillRect(this._apple.x * this._freeCellSize, this._apple.y * this._freeCellSize, this._freeCellSize, this._freeCellSize);
  }
}

export default GameField;
